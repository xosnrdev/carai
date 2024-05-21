// Copyright 2022-2023 Teknologi Umum and contributors
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import fetch, { type Response } from "node-fetch";
import {

  InternalServerError,
  MissingParameterError,
  RuntimeNotFoundError,
} from "../lib/error";
import type { CodeRequest, CodeResponse, ErrorResponse } from "../lib/response";

export type ClientConfig = {
  baseURL?: URL;
};

export class RCEClient {
  private readonly baseURL: URL;

  constructor(config: ClientConfig) {
    this.baseURL = config.baseURL ?? new URL("http://localhost:50051");
  }

  public async execute(codeRequest: CodeRequest, abortSignal?: AbortSignal): Promise<CodeResponse> {
    const response = await fetch(new URL("/api/execute", this.baseURL).toString(), {
      signal: abortSignal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(codeRequest),
      method: "POST"
    });

    if (response.status !== 200) {
      await this.processError(response);
    }

    const body = (await response.json()) as CodeResponse;
    return {
      language: body.language,
      version: body.version,
      runtime: body.runtime,
      compile: body.compile
    };
  }

  private async processError(response: Response): Promise<void> {
    switch (response.status) {
      case 404:
        throw new Error("api path not found");
      case 500: {
        const body = (await response.json()) as ErrorResponse;
        throw new InternalServerError(body.message);
      }

      case 400: {
        const body = (await response.json()) as ErrorResponse;
        if (body?.message === "Runtime not found") throw new RuntimeNotFoundError();
        if (body?.message.startsWith("Missing parameters")) throw new MissingParameterError(body.message);
        throw new Error(
          `${body.message} (this is probably a problem with the SDK, please submit an issue on our Github repository)`
        );
      }
    }

    const body = await response.text();
    throw new Error(
      `Received ${response.status} with body ${body} (this is probably a problem with the SDK, please submit an issue on our Github repository)`
    );
  }
}
