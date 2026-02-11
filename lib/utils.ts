import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { SearchEngineHit } from "./type/smartsearch";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getDynamicFields(hit: SearchEngineHit) {
	const knownKeys: (keyof SearchEngineHit)[] = [
		"id_primaryKey",
		"id_PrimaryKey",
		"grup",
		"filename",
	];
	return Object.entries(hit).filter(([key]) => !knownKeys.includes(key));
}

export function formattedDateToDDMMYYYY(assumedDate: string) {
	const date = new Date(assumedDate);
	if (Number.isNaN(date.getTime())) {
		throw new Error("Could not convert date to appropriate format");
	}
	return new Intl.DateTimeFormat("en-GB", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	}).format(date);
}
