// 1. Add Toaster to your root layout
import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}

// 2. Use toast anywhere in your app
import { toast } from "@/components/ui/toaster";

// Success
toast.success({
  title: "Success",
  description: "Operation completed successfully",
});

// Error
toast.error({
  title: "Error",
  description: "Something went wrong",
});

// Warning
toast.warning({
  title: "Warning",
  description: "Please check your input",
});

// Info
toast.info({
  title: "Info",
  description: "New update available",
});

// With Action
toast.success({
  title: "Message sent",
  description: "Your message was delivered",
  action: {
    label: "Undo",
    onClick: () => console.log("Undo clicked"),
  },
});

// Custom Duration
toast.info({
  title: "This stays longer",
  description: "Will auto-dismiss after 6 seconds",
  duration: 6000,
});

// Without Title
toast.success({
  description: "Quick success message",
});