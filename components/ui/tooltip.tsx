import { Tooltip } from "@/components/ui/tooltip";

// Basic
<Tooltip content="This is a tooltip">
  <button>Hover me</button>
</Tooltip>

// Different Sides
<Tooltip content="Top tooltip" side="top">
  <span>Top</span>
</Tooltip>

<Tooltip content="Bottom tooltip" side="bottom">
  <span>Bottom</span>
</Tooltip>

<Tooltip content="Left tooltip" side="left">
  <span>Left</span>
</Tooltip>

<Tooltip content="Right tooltip" side="right">
  <span>Right</span>
</Tooltip>

// Alignment
<Tooltip content="Start aligned" align="start">
  <span>Start</span>
</Tooltip>

<Tooltip content="Center aligned" align="center">
  <span>Center</span>
</Tooltip>

<Tooltip content="End aligned" align="end">
  <span>End</span>
</Tooltip>

// Custom Delay
<Tooltip content="Shows after 200ms" delay={200}>
  <span>Fast tooltip</span>
</Tooltip>

// With Icons
<Tooltip content="Settings">
  <button className="p-2"><Settings className="w-5 h-5" /></button>
</Tooltip>