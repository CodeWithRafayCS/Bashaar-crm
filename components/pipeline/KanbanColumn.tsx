"use client";

import { Droppable } from "@hello-pangea/dnd";
import type { Lead } from "@/lib/types";
import { formatCurrency } from "@/lib/utils/format";
import { KanbanCard } from "./KanbanCard";
import { 
  Plus, 
  AlertCircle, 
  Phone, 
  CheckCircle, 
  Star, 
  Calendar, 
  MessageSquare, 
  TrendingUp,
  XCircle,
  Building2,
} from "lucide-react";
import { Button } from "@/components/common/Button";

interface KanbanColumnProps {
  stage: string;
  leads: Lead[];
  onMove?: (leadId: string, stage: string) => Promise<void>;
  onAdd?: () => void;
  onLeadClick?: (leadId: string) => void;
  onEdit?: (leadId: string) => void;
  onDelete?: (leadId: string) => void;
  isDraggingOver?: boolean;
}

const STAGE_COLORS: Record<string, string> = {
  "New": "#4285f4",
  "Attempted": "#9c27b0",
  "Connected": "#00c853",
  "Interested": "#ffc107",
  "Meeting Scheduled": "#f4c542",
  "Proposal Sent": "#ff6f00",
  "Negotiation": "#ff4444",
  "Won": "#00c853",
  "Lost": "#ff4444",
};

const STAGE_ICONS: Record<string, React.ReactNode> = {
  "New": <AlertCircle className="column-icon" />,
  "Attempted": <Phone className="column-icon" />,
  "Connected": <CheckCircle className="column-icon" />,
  "Interested": <Star className="column-icon" />,
  "Meeting Scheduled": <Calendar className="column-icon" />,
  "Proposal Sent": <MessageSquare className="column-icon" />,
  "Negotiation": <TrendingUp className="column-icon" />,
  "Won": <CheckCircle className="column-icon" />,
  "Lost": <XCircle className="column-icon" />,
};

export function KanbanColumn({
  stage,
  leads,
  onAdd,
  onLeadClick,
  onEdit,
  onDelete,
  isDraggingOver = false,
}: KanbanColumnProps) {
  const totalValue = leads.reduce((sum, lead) => sum + lead.value, 0);
  const stageColor = STAGE_COLORS[stage] || "#ffffff";
  const stageIcon = STAGE_ICONS[stage] || <Building2 className="column-icon" />;

  return (
    <Droppable droppableId={stage}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`kanban-column ${snapshot.isDraggingOver ? "dragging-over" : ""}`}
        >
          {/* Column Header */}
          <div className="column-header">
            <div className="column-header-left">
              <span className="column-icon-wrapper" style={{ color: stageColor }}>
                {stageIcon}
              </span>
              <h3 className="column-title">{stage}</h3>
              <span className="column-count">{leads.length}</span>
            </div>
            <div className="column-header-right">
              <span className="column-value">{formatCurrency(totalValue)}</span>
            </div>
          </div>

          {/* Column Body */}
          <div className="column-body">
            {leads.length === 0 ? (
              <div className="column-empty">
                <p>No leads</p>
              </div>
            ) : (
              leads.map((lead, index) => (
                <KanbanCard
                  key={lead.id}
                  lead={lead}
                  index={index}
                  onClick={onLeadClick}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            )}
            {provided.placeholder}
          </div>

          {/* Column Footer */}
          <div className="column-footer">
            <Button
              type="button"
              variant="ghost"
              className="add-card-btn"
              onClick={onAdd}
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </Button>
          </div>

          <style jsx>{`
            .kanban-column {
              flex: 1;
              min-width: 260px;
              max-width: 340px;
              background: rgba(255, 255, 255, 0.02);
              border: 1px solid rgba(255, 255, 255, 0.04);
              border-radius: 12px;
              display: flex;
              flex-direction: column;
              max-height: 100%;
              transition: all 0.3s;
            }

            .kanban-column.dragging-over {
              border-color: rgba(244, 197, 66, 0.2);
              background: rgba(244, 197, 66, 0.02);
            }

            /* Column Header */
            .column-header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 0.75rem 1rem;
              border-bottom: 1px solid rgba(255, 255, 255, 0.04);
              flex-shrink: 0;
            }

            .column-header-left {
              display: flex;
              align-items: center;
              gap: 0.4rem;
            }

            .column-icon-wrapper {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 20px;
              height: 20px;
            }

            .column-icon {
              width: 16px;
              height: 16px;
            }

            .column-title {
              font-size: 0.8rem;
              font-weight: 600;
              color: rgba(255, 255, 255, 0.6);
              margin: 0;
            }

            .column-count {
              font-size: 0.65rem;
              padding: 0.05rem 0.4rem;
              background: rgba(255, 255, 255, 0.04);
              border-radius: 4px;
              color: rgba(255, 255, 255, 0.2);
            }

            .column-value {
              font-size: 0.7rem;
              font-weight: 500;
              color: rgba(244, 197, 66, 0.4);
            }

            /* Column Body */
            .column-body {
              flex: 1;
              padding: 0.5rem;
              overflow-y: auto;
              min-height: 200px;
            }

            .column-body::-webkit-scrollbar {
              width: 3px;
            }

            .column-body::-webkit-scrollbar-track {
              background: transparent;
            }

            .column-body::-webkit-scrollbar-thumb {
              background: rgba(244, 197, 66, 0.1);
              border-radius: 2px;
            }

            .column-empty {
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 1.5rem;
              color: rgba(255, 255, 255, 0.05);
              font-size: 0.8rem;
              font-style: italic;
            }

            /* Column Footer */
            .column-footer {
              padding: 0.5rem;
              border-top: 1px solid rgba(255, 255, 255, 0.03);
              flex-shrink: 0;
            }

            .add-card-btn {
              width: 100% !important;
              justify-content: center !important;
              padding: 0.3rem !important;
              font-size: 0.75rem !important;
              color: rgba(255, 255, 255, 0.15) !important;
            }

            .add-card-btn:hover {
              color: rgba(255, 255, 255, 0.3) !important;
              background: rgba(255, 255, 255, 0.04) !important;
            }

            /* Responsive */
            @media (max-width: 1024px) {
              .kanban-column {
                min-width: 220px;
                max-width: 280px;
              }
            }

            @media (max-width: 768px) {
              .kanban-column {
                min-width: unset;
                max-width: unset;
                max-height: 400px;
              }

              .column-body {
                min-height: 100px;
                max-height: 250px;
              }
            }

            @media (max-width: 480px) {
              .kanban-column {
                max-height: 300px;
              }

              .column-body {
                max-height: 150px;
              }

              .column-title {
                font-size: 0.7rem;
              }

              .column-icon {
                width: 14px;
                height: 14px;
              }
            }
          `}</style>
        </div>
      )}
    </Droppable>
  );
}