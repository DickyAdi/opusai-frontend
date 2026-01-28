/** biome-ignore-all lint/security/noDangerouslySetInnerHtml: <meilisearch marks> */
/** biome-ignore-all lint/security/noDangerouslySetInnerHtmlWithChildren: <meilisearch marks> */
import { useGetSearchHits } from "@/hooks/useSmartsearch";
import { getDynamicFields } from "@/lib/utils";

export function EmptyResultBox() {
	return (
		<div className="flex flex-col p-8 rounded-xl border-2 border-dashed items-center justify-center h-full w-full">
			<h1 className="text-xl text-muted-foreground text-balance">
				Search results will appear here
			</h1>
		</div>
	);
}

export function ResultBox() {
	const hits = useGetSearchHits();

	return (
		<div className="flex flex-col gap-4 p-4">
			{hits.map((e) => {
				const dynamicFields = getDynamicFields(e._formatted);

				return (
					<div
						key={e._formatted.id_primaryKey}
						className="flex flex-col rounded-lg p-4 border bg-muted"
					>
						<h4
							className="text-lg"
							dangerouslySetInnerHTML={{ __html: e._formatted.grup }}
						/>
						{dynamicFields.map(([key, value]) => (
							<p
								key={key}
								className="text-xs text-balance"
								dangerouslySetInnerHTML={{ __html: `${key}: ${String(value)}` }}
							/>
						))}
					</div>
				);
			})}
		</div>
	);
}
