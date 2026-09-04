import { HoverCard } from "@/components/ui/hover-card";

// Basic
<HoverCard
  content={
    <div>
      <h4 className="hover-card-title">User Info</h4>
      <p className="hover-card-description">This is additional information</p>
    </div>
  }
>
  <span>Hover me</span>
</HoverCard>

// With Custom Content
<HoverCard
  content={
    <div className="p-2">
      <img 
        src="/avatar.jpg" 
        alt="Avatar" 
        className="hover-card-image w-12 h-12 rounded-full"
      />
      <div className="hover-card-divider" />
      <h4 className="hover-card-title">John Doe</h4>
      <p className="hover-card-description">Software Engineer</p>
    </div>
  }
  side="right"
  align="start"
>
  <button>View Profile</button>
</HoverCard>

// Different Side
<HoverCard
  content={<div>Content</div>}
  side="top"
>
  <span>Hover for top</span>
</HoverCard>

// Custom Delays
<HoverCard
  content={<div>Content</div>}
  openDelay={200}
  closeDelay={100}
>
  <span>Quick response</span>
</HoverCard>

// Controlled
const [open, setOpen] = useState(false);

<HoverCard
  content={<div>Content</div>}
  open={open}
  onOpenChange={setOpen}
>
  <span>Controlled hover card</span>
</HoverCard>