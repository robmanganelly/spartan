import { InjectionToken } from "@angular/core";
import {  TFieldHandlers } from "./handlers";

export const FilterHandlerToken = new InjectionToken<TFieldHandlers>('FilterHandlerToken');
