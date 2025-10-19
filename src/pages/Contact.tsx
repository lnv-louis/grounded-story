import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Mail } from "lucide-react";
import logo from "@/assets/grounded-logo.png";

const Contact = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate sending message
    setTimeout(() => {
      toast.success("Message sent successfully!");
      setName("");
      setEmail("");
      setMessage("");
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <img src={logo} alt="Grounded" className="h-8 w-8" />
          <h1 className="text-2xl font-bold">Contact Us</h1>
        </div>

        <Card className="p-8 bg-card/50 border-border/50">
          <div className="flex items-center gap-3 mb-6">
            <Mail className="h-6 w-6" />
            <h2 className="text-xl font-semibold">Get in Touch</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-secondary/50"
              />
            </div>
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-secondary/50"
              />
            </div>
            <div>
              <Textarea
                placeholder="Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={6}
                className="bg-secondary/50"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Contact;
