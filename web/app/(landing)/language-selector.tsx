import type { Selection } from "@nextui-org/table";

import { Avatar } from "@nextui-org/avatar";
import { Select, SelectItem } from "@nextui-org/select";
import { useTheme } from "next-themes";
import { useMemo, useState } from "react";

import { runtimeRecord } from "@/config/editor/constants";
import { languageNameTransformMap, transformString } from "@/lib/utils";

import CodeBlock from "./code-block";

export default function LanguageSelector() {
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([".js"]));
    const { resolvedTheme } = useTheme();

    const selectedRuntime = useMemo(() => {
        if (!(selectedKeys instanceof Set)) {
            return;
        }
        const key = selectedKeys.values().next().value ?? ".js";

        return runtimeRecord[key];
    }, [selectedKeys]);

    return (
        <div className="mx-auto space-y-6 md:max-w-2xl lg:max-w-3xl">
            <Select
                classNames={{
                    base: "md:max-w-xs w-full mx-auto",
                    trigger: "h-12",
                }}
                color={resolvedTheme === "dark" ? "default" : "primary"}
                items={Object.entries(runtimeRecord)}
                label="Select a language"
                labelPlacement="outside"
                renderValue={(items) => {
                    return items.map((item) => (
                        <div key={item.key} className="flex flex-row items-center gap-2">
                            <Avatar
                                alt={`${item.data?.[1].languageName} icon`}
                                className="flex-shrink-0"
                                size="sm"
                                src={`/assets/language/${item.data?.[1].languageName.toLowerCase()}.svg`}
                            />
                            <div className="flex flex-col">
                                <span>
                                    {transformString({
                                        str: item.data?.[1].languageName ?? "",
                                        map: languageNameTransformMap,
                                        capitalize: true,
                                    })}
                                </span>
                                <span className="text-tiny text-default-500">
                                    ({item.data?.[1].filename})
                                </span>
                            </div>
                        </div>
                    ));
                }}
                selectedKeys={selectedKeys}
                selectionMode="single"
                variant="bordered"
                onSelectionChange={setSelectedKeys}
            >
                {(runtimeRecord) => (
                    <SelectItem key={runtimeRecord[0]} textValue={runtimeRecord[1].languageName}>
                        <div className="flex flex-row items-center gap-2">
                            <Avatar
                                alt={runtimeRecord[1].languageName}
                                className="flex-shrink-0"
                                size="sm"
                                src={`/assets/language/${runtimeRecord[1].languageName.toLowerCase()}.svg`}
                            />
                            <div className="flex flex-col">
                                <span className="text-small">
                                    {transformString({
                                        str: runtimeRecord[1].languageName,
                                        map: languageNameTransformMap,
                                        capitalize: true,
                                    })}
                                </span>
                                <span className="text-tiny text-default-400">
                                    {runtimeRecord[1].filename}
                                </span>
                            </div>
                        </div>
                    </SelectItem>
                )}
            </Select>
            {selectedRuntime && (
                <CodeBlock key={selectedRuntime.languageName} {...selectedRuntime} />
            )}
        </div>
    );
}
