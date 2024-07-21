import * as Sentry from "@sentry/node";

export interface User {
  uid: number;
  gid: number;
  free: boolean;
  username: string;
}

export class SystemUsers {
  users: User[];
  constructor(start: number, stop: number, defaultGroup: number) {
    if (start > stop) {
      throw new TypeError("Invalid user range");
    }

    this.users = [];
    for (let i = start; i <= stop; i++) {
      this.users.push({
        uid: i,
        gid: defaultGroup,
        free: true,
        username: `code_executor_${i}`
      });
    }
  }

  public acquire(): User | null {
    return Sentry.startSpan({
      name: 'Acquire System Users',
      op: "system_users.acquire"
    }, (span) => {
      const userIndex = this.users.findIndex(u => u.free);
      if (userIndex !== -1) {
        const user = this.users[userIndex];
        this.users[userIndex].free = false;
        span?.end();
        return user;
      }
      span?.end();
      return null;
    });
  }

  public release(uid: number): void {
    Sentry.startSpan({
      name: 'Release System Users',
      op: "system_users.release"
    }, (span) => {
      const userIndex = this.users.findIndex(u => u.uid === uid);
      if (userIndex !== -1) {
        this.users[userIndex].free = true;
      }

      span?.end();
    });
  }
}
