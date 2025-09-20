import Link from "next/link";
import { ArrowLeft, Package2, Tag } from "lucide-react";
import ItemDetailClient from "@/components/admin/item-detail";
import { ItemUtils } from "@/lib/item-utils";

export default async function ItemDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params
  const item = await ItemUtils.getItemData(id);

  if (item) {
    
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/items" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back to Items</span>
          </Link>
        </div>

        {/* Header card */}
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <Package2 className="h-5 w-5 text-violet-600" />
              <h1 className="text-base font-semibold text-slate-800">{item.name}</h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 ring-1 ring-slate-200 px-2.5 py-1 text-xs text-slate-700">
                <Tag className="h-3.5 w-3.5 text-sky-600" />
                {item.category?.name ?? "Uncategorized"}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 ring-1 ring-slate-200 px-2.5 py-1 text-xs text-slate-700">
                Stock: <strong className="tabular-nums">{item.stock}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Store filter + inline chart + latest + history */}
        <ItemDetailClient item={item} purchases={item.purchases ?? []} stores={[]} />
      </div>
    );
  }
}
