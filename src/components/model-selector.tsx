import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

//to do
const MOCK_MODELS = [
  {
    id: "1",
    name: "Model 1",
    tags: ["chat", "fast"],
    description: "Model 1 description",
  },
  {
    id: "2",
    name: "Model 2",
    tags: ["chat", "thinking"],
    description: "Model 2 description",
  },
];

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
}

export function ModelSelector({
  selectedModel,
  onModelChange,
}: ModelSelectorProps) {
  const currentModel = MOCK_MODELS.find((m) => m.id === selectedModel);

  return (
    <Select value={selectedModel} onValueChange={onModelChange}>
      <SelectTrigger
        className="w-full min-w-0 border-none bg-transparent p-1 hover:bg-secondary/50"
        data-testid="select-model-trigger"
      >
        <SelectValue placeholder="Select a model">
          {currentModel && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="text-foreground flex items-center gap-2">
                {currentModel.name}
                <span className="text-muted-foreground/50 text-xs font-normal font-mono">
                  {currentModel.tags?.[0]}
                </span>
              </span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>

      <SelectContent className="bg-popover border-border/50 shadow-xl min-w-60">
        {MOCK_MODELS.map((model) => (
          <SelectItem
            key={model.id}
            value={model.id}
            className="focus:bg-secondary/50 focus:text-foreground py-3 cursor-pointer"
            data-testid={`select-item-${model.id}`}
          >
            <div className="flex flex-col gap-1">
              <div className="font-medium flex items-center justify-between gap-4">
                {model.name}
                {model.tags && (
                  <span className="text-[10px] uppercase tracking-wider font-mono text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
                    {model.tags[0]}
                  </span>
                )}
              </div>
              <div className="text-xs text-muted-foreground line-clamp-1">
                {model.description}
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
