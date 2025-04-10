export type ActiveMode = "focus" | "shortRest" | "longRest" | "settings";
export type PomodoroActions = {
  focus: "pause" | "running";
  shortRest: "pause" | "running";
  longRest: "pause" | "running";
};
export type NotificationsActions =
  | "focus-end"
  | "short-rest-end"
  | "long-rest-end"
  | "long-rest-start";
export type LocalConfig = {
  focus: string;
  shortRest: string;
  longRest: string;
  cicles: number;
  pallete: "midnight" | "red" | "capuccino";
  initalTimeConfig: {
    autoStartFocus: boolean;
    autoStartRest: boolean;
  };
};
