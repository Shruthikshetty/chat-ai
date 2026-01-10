import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOllamaModels } from "@/hooks/useOllamaModels";
import { useSelecteModel } from "@/state-management/selected-mode-store";

export function ModelSelector() {
  //get selected model from store
  const { selectedModel, setSelectedModel } = useSelecteModel((state) => state);
  //hook to get models
  const { availableModels } = useOllamaModels();
  const currentModel = availableModels.find((m) => m.id === selectedModel?.id);

  return (
    <Select
      value={selectedModel?.id ?? ""}
      onValueChange={(modelId) => {
        const model = availableModels?.find((m) => m.id === modelId);
        if (model) {
          setSelectedModel(model);
        }
      }}
    >
      <SelectTrigger
        className="w-full min-w-0 border-none bg-transparent p-1 hover:bg-secondary/50"
        data-testid="select-model-trigger"
      >
        <SelectValue placeholder="Select a model">
          {currentModel ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="text-foreground flex items-center gap-2">
                {currentModel.name}
                <span className="text-muted-foreground/50 text-xs font-normal font-mono">
                  {currentModel.tags?.[0]}
                </span>
              </span>
            </div>
          ) : (
            <span className="text-muted-foreground">Select a model</span>
          )}
        </SelectValue>
      </SelectTrigger>

      <SelectContent className="bg-popover border-border/50 shadow-xl min-w-60">
        {availableModels.length === 0 ? (
          <div className="p-3 text-sm text-muted-foreground text-center">
            No models found. Ensure Ollama is running.
          </div>
        ) : (
          availableModels.map((model) => (
            <SelectItem
              key={model.id}
              value={model.id}
              className="focus:bg-secondary/50 focus:text-foreground py-3 cursor-pointer"
              data-testid={`select-item-${model.id}`}
            >
              <div className="flex flex-col gap-1">
                <div className="font-medium flex items-center justify-between gap-4">
                  {model.name}
                  {model.tags && model.tags.length > 0 && (
                    <span className="text-[10px] uppercase tracking-wider font-mono text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
                      {model.tags[0]}
                    </span>
                  )}
                </div>
                {model.description && (
                  <div className="text-xs text-muted-foreground line-clamp-1">
                    {model.description}
                  </div>
                )}
              </div>
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}
