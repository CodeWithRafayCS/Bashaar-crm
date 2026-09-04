import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

// Basic
<Label>Name</Label>

// With htmlFor
<Label htmlFor="email">Email</Label>
<Input id="email" />

// Required
<Label required>Required Field</Label>

// Sizes
<Label size="sm">Small Label</Label>
<Label size="md">Medium Label</Label>
<Label size="lg">Large Label</Label>

// Variants
<Label>Default</Label>
<Label variant="secondary">Secondary</Label>
<Label variant="muted">Muted</Label>

// With Input
<div className="flex flex-col gap-1">
  <Label htmlFor="username" required>Username</Label>
  <Input id="username" placeholder="Enter username" />
</div>