import { Widget } from "@/types";
import { SearchWidget as SearchWidgetType } from "../widgets/SearchWidget/types";
import { AppsWidget as AppsWidgetType } from "../widgets/AppsWidget/types";
import { LinksWidget as LinksWidgetType } from "../widgets/LinksWidget/types";
import { SearchWidget } from "../widgets/SearchWidget";
import { AppsWidget } from "../widgets/AppsWidget";
import { LinksWidget } from "../widgets/LinksWidget";

export default function WidgetRenderer({ widgets }: { widgets: Widget[] }) {
  const renderWidget = (widget: Widget) => {
    if (widget.type === "search-widget") {
      return <SearchWidget {...(widget as SearchWidgetType)} />;
    }
    if (widget.type === "apps-widget") {
      return <AppsWidget {...(widget as AppsWidgetType)} />;
    }
    if (widget.type === "links-widget") {
      return <LinksWidget {...(widget as LinksWidgetType)} />;
    }
  };

  return (
    <>
      {widgets.map((widget, index) => (
        <div key={`$${widget.type}-${index}`}>{renderWidget(widget)}</div>
      ))}
    </>
  );
}
