import { InjectionToken } from "@angular/core";
import {  TFieldHandlers } from "./handlers";

export const FILTER_HANDLER = new InjectionToken<TFieldHandlers>('FilterHandlerToken');
