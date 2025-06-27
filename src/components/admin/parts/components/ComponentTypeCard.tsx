
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Plus, Edit, Trash2 } from "lucide-react";

interface ComponentTypeCardProps {
  title: string;
  icon: React.ReactNode;
  data: any[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  renderItem: (item: any) => React.ReactNode;
}

const ComponentTypeCard: React.FC<ComponentTypeCardProps> = ({
  title,
  icon,
  data,
  loading,
  onAdd,
  onEdit,
  onDelete,
  renderItem
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredData = data.filter(item => 
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="bg-explorer-card border-explorer-chrome/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-explorer-text flex items-center gap-2">
            {icon}
            {title}
            <Badge variant="secondary" className="ml-2">
              {data.length}
            </Badge>
          </CardTitle>
          <Button
            onClick={onAdd}
            size="sm"
            className="bg-accent-teal hover:bg-accent-teal/80"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-explorer-text-muted" />
          <Input
            placeholder={`Search ${title.toLowerCase()}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-explorer-dark border-explorer-chrome/30"
          />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-explorer-text-muted">
            Loading {title.toLowerCase()}...
          </div>
        ) : filteredData.length === 0 ? (
          <div className="text-center py-8 text-explorer-text-muted">
            {searchTerm ? `No ${title.toLowerCase()} found` : `No ${title.toLowerCase()} created yet`}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredData.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-explorer-dark rounded-lg border border-explorer-chrome/20"
              >
                <div className="flex-1">
                  {renderItem(item)}
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(item.id)}
                    className="border-explorer-chrome/30 text-explorer-text hover:bg-explorer-chrome/20"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(item.id)}
                    className="border-red-400/30 text-red-400 hover:bg-red-400/10"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ComponentTypeCard;
