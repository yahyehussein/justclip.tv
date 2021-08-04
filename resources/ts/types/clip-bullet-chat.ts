import { Clip } from "./clip";
import { Report } from "./report";

export interface ClipBulletChat {
    id: number;
    color: number;
    text: number;
    report: Report;
    report_count?: number;
    clip?: Clip;
}
