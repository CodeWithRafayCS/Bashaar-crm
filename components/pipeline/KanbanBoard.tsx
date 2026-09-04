"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import type { Lead } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { 
  Plus, 
  MoreVertical, 
  User, 
  DollarSign, 
  Calendar, 
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Phone,
  Mail,
  Building2,
} from "lucide-react";
import { Button } from "@/components/common/Button";

interface KanbanBoardProps {
  leads: Lead[];
  onMove: (leadId: string, stage: string) => Promise<void>;
  onAdd: () => void;
  onLeadClick?: (leadId: string) => void;
  loading?: boolean;
}

const STAGES = [
  "New",
  "Attempted",
  "Connected",
  "Interested",
  "Meeting Scheduled",
  "Proposal Sent",
  "Negotiation",
];

const STAGE_COLORS: Record<string, string> = {
  "New": "#4285f4",
  "Attempted": "#9c27b0",
  "Connected": "#00c853",
  "Interested": "#ffc107",
  "Meeting Scheduled": "#f4c542",
  "Proposal Sent": "#ff6f00",
  "Negotiation": "#ff4444",
};

const STAGE_ICONS: Record<string, React.ReactNode> = {
  "New": <AlertCircle className="stage-icon" />,
  "Attempted": <Phone className="stage-icon" />,
  "Connected": <CheckCircle className="stage-icon" />,
  "Interested": <Building2 className="stage-icon" />,
  "Meeting Scheduled": <Calendar className="stage-icon" />,
  "Proposal Sent": <DollarSign className="stage-icon" />,
  "Negotiation": <XCircle className="stage-icon" />,
};

export function KanbanBoard({
  leads,
  onMove,
  onAdd,
  onLeadClick,
  loading = false,
}: KanbanBoardProps) {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [draggingLeadId, setDraggingLeadId] = useState<string | null>(null);

  const getLeadsByStage = (stage: string) => {
    return leads.filter((lead) => lead.stage === stage);
  };

  const toggleCardExpand = (leadId: string) => {
    setExpandedCards((prev) => {
      const next = new Set(prev);
      if (next.has(leadId)) next.delete(leadId);
      else next.add(leadId);
      return next;
    });
  };

  const handleDragStart = (start: any) => {
    setDraggingLeadId(start.draggableId);
  };

  const handleDragEnd = async (result: DropResult) => {
    setDraggingLeadId(null);
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    await onMove(draggableId, destination.droppableId);
  };

  if (loading) {
    return (
      <div className="kanban-loading">
        <div className="spinner" />
        <span>Loading pipeline...</span>
      </div>
    );
  }

  return (
    <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="kanban-board">
        {STAGES.map((stage) => {
          const stageLeads = getLeadsByStage(stage);
          const totalValue = stageLeads.reduce((sum, lead) => sum + lead.value, 0);
          const stageColor = STAGE_COLORS[stage] || "#ffffff";
          const stageIcon = STAGE_ICONS[stage];

          return (
            <Droppable key={stage} droppableId={stage}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`kanban-column ${snapshot.isDraggingOver ? "dragging-over" : ""}`}
                >
                  <div className="column-header">
                    <div className="column-header-left">
                      <span className="column-icon" style={{ color: stageColor }}>
                        {stageIcon}
                      </span>
                      <h3 className="column-title">{stage}</h3>
                      <span className="column-count">{stageLeads.length}</span>
                    </div>
                    <div className="column-header-right">
                      <span className="column-value">{formatCurrency(totalValue)}</span>
                    </div>
                  </div>

                  <div className="column-body">
                    {stageLeads.length === 0 ? (
                      <div className="column-empty">
                        <p>No leads</p>
                      </div>
                    ) : (
                      stageLeads.map((lead, index) => (
                        <Draggable key={lead.id} draggableId={lead.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`kanban-card ${snapshot.isDragging ? "dragging" : ""}`}
                              onClick={() => onLeadClick?.(lead.id)}
                            >
                              <div className="card-header">
                                <div className="card-title-wrapper">
                                  <h4 className="card-title">{lead.name}</h4>
                                  <span className="card-company">{lead.company}</span>
                                </div>
                                <button
                                  className="card-expand"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleCardExpand(lead.id);
                                  }}
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </button>
                              </div>

                              <div className="card-body">
                                <div className="card-value">
                                  <DollarSign className="value-icon" />
                                  <span>{formatCurrency(lead.value)}</span>
                                </div>
                                <div className="card-owner">
                                  <User className="owner-icon" />
                                  <span>{lead.ownerEmail}</span>
                                </div>
                              </div>

                              {lead.followUpDate && (
                                <div className="card-footer">
                                  <Clock className="followup-icon" />
                                  <span>{formatDate(lead.followUpDate)}</span>
                                </div>
                              )}

                              {expandedCards.has(lead.id) && (
                                <div className="card-details">
                                  <div className="detail-row">
                                    <Phone className="detail-icon" />
                                    <span>{lead.phone || "No phone"}</span>
                                  </div>
                                  <div className="detail-row">
                                    <Mail className="detail-icon" />
                                    <span>{lead.email || "No email"}</span>
                                  </div>
                                  {lead.notes && (
                                    <div className="detail-row notes">
                                      <span>{lead.notes}</span>
                                    </div>
                                  )}
                                  <div className="detail-row">
                                    <span className="detail-label">Source:</span>
                                    <span>{lead.source || "Unknown"}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))
                    )}
                    {provided.placeholder}
                  </div>

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
                </div>
              )}
            </Droppable>
          );
        })}
      </div>

      <style jsx>{`
        .kanban-board {
          display: flex;
          gap: 0.75rem;
          padding: 0.5rem;
          overflow-x: auto;
          min-height: 500px;
          height: 100%;
          align-items: stretch;
        }

        .kanban-board::-webkit-scrollbar {
          height: 6px;
        }

        .kanban-board::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 3px;
        }

        .kanban-board::-webkit-scrollbar-thumb {
          background: rgba(244, 197, 66, 0.15);
          border-radius: 3px;
        }

        /* Loading */
        .kanban-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          gap: 0.75rem;
          color: rgba(255, 255, 255, 0.15);
        }

        .spinner {
          width: 32px;
          height: 32px;
          border: 3px solid rgba(255, 255, 255, 0.04);
          border-top-color: #f4c542;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Column */
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

        .column-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
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

        /* Card */
        .kanban-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 8px;
          padding: 0.6rem 0.75rem;
          margin-bottom: 0.4rem;
          cursor: pointer;
          transition: all 0.3s;
        }

        .kanban-card:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.06);
        }

        .kanban-card.dragging {
          opacity: 0.5;
          transform: rotate(2deg) scale(0.98);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.3rem;
        }

        .card-title-wrapper {
          flex: 1;
          min-width: 0;
        }

        .card-title {
          font-size: 0.8rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.7);
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .card-company {
          font-size: 0.65rem;
          color: rgba(255, 255, 255, 0.2);
        }

        .card-expand {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border: none;
          background: transparent;
          border-radius: 4px;
          color: rgba(255, 255, 255, 0.1);
          cursor: pointer;
          transition: all 0.3s;
          flex-shrink: 0;
        }

        .card-expand:hover {
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.3);
        }

        .card-body {
          display: flex;
          flex-wrap: wrap;
          gap: 0.3rem 0.5rem;
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.3);
        }

        .card-value {
          display: flex;
          align-items: center;
          gap: 0.2rem;
          font-weight: 600;
          color: #f4c542;
        }

        .value-icon {
          width: 12px;
          height: 12px;
        }

        .card-owner {
          display: flex;
          align-items: center;
          gap: 0.2rem;
        }

        .owner-icon {
          width: 12px;
          height: 12px;
        }

        .card-footer {
          display: flex;
          align-items: center;
          gap: 0.2rem;
          margin-top: 0.3rem;
          padding-top: 0.3rem;
          border-top: 1px solid rgba(255, 255, 255, 0.03);
          font-size: 0.6rem;
          color: rgba(255, 255, 255, 0.15);
        }

        .followup-icon {
          width: 12px;
          height: 12px;
        }

        /* Card Details (Expanded) */
        .card-details {
          margin-top: 0.3rem;
          padding-top: 0.3rem;
          border-top: 1px solid rgba(255, 255, 255, 0.03);
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .detail-row {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.65rem;
          color: rgba(255, 255, 255, 0.25);
        }

        .detail-icon {
          width: 12px;
          height: 12px;
          color: rgba(255, 255, 255, 0.1);
        }

        .detail-row.notes {
          padding: 0.2rem 0.3rem;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 4px;
          font-style: italic;
          color: rgba(255, 255, 255, 0.2);
          font-size: 0.6rem;
        }

        .detail-label {
          color: rgba(255, 255, 255, 0.1);
          font-weight: 500;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .kanban-board {
            gap: 0.5rem;
            padding: 0.25rem;
          }

          .kanban-column {
            min-width: 220px;
            max-width: 280px;
          }
        }

        @media (max-width: 768px) {
          .kanban-board {
            flex-direction: column;
            align-items: stretch;
            padding: 0.25rem;
            gap: 0.5rem;
          }

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

          .card-title {
            font-size: 0.75rem;
          }

          .card-body {
            font-size: 0.65rem;
          }
        }
      `}</style>
    </DragDropContext>
  );
}
