import { useState, useEffect } from "react";
import { Heart, Users, Lock } from "lucide-react";
import { FeedbackForm } from "./components/feedback-form";
import { FeedbackList } from "./components/feedback-list";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./components/ui/dialog";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { projectId, publicAnonKey } from "/utils/supabase/info";

interface Feedback {
  id: string;
  text: string;
  timestamp: Date;
  name?: string;
  isSecret?: boolean;
  secretMessage?: string;
}

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-ef705bb0`;

export default function App() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [clickCount, setClickCount] = useState(0);
  const [showPasswordDialog, setShowPasswordDialog] =
    useState(false);
  const [password, setPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [activeTab, setActiveTab] = useState("share");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch feedbacks on mount
  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await fetch(`${API_URL}/feedbacks`, {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch feedbacks");
      }

      const data = await response.json();
      const formattedFeedbacks = (data.feedbacks || []).map(
        (fb: any) => ({
          ...fb,
          timestamp: new Date(fb.timestamp),
        }),
      );
      setFeedbacks(formattedFeedbacks);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitFeedback = async (
    text: string,
    name?: string,
    secretMessage?: string,
  ) => {
    try {
      // Submit main feedback to community voices
      const mainResponse = await fetch(`${API_URL}/feedbacks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          text,
          name,
          isSecret: false,
        }),
      });

      if (!mainResponse.ok) {
        throw new Error("Failed to submit main feedback");
      }

      // If there's a secret message, submit it separately
      if (secretMessage) {
        const secretResponse = await fetch(
          `${API_URL}/feedbacks`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${publicAnonKey}`,
            },
            body: JSON.stringify({
              text: secretMessage,
              name,
              isSecret: true,
            }),
          },
        );

        if (!secretResponse.ok) {
          throw new Error("Failed to submit secret feedback");
        }
      }

      // Refresh the feedbacks list
      await fetchFeedbacks();
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback. Please try again.");
    }
  };

  const handleCommunityClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (newCount === 5) {
      setShowPasswordDialog(true);
      setClickCount(0);
    }
  };

  const handlePasswordSubmit = () => {
    if (password === "030114") {
      setIsUnlocked(true);
      setShowPasswordDialog(false);
      setActiveTab("secret");
      setPassword("");
    } else {
      alert("Incorrect password");
      setPassword("");
    }
  };

  const publicFeedbacks = feedbacks.filter((f) => !f.isSecret);
  const secretFeedbacks = feedbacks.filter((f) => f.isSecret);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl mb-2 text-emerald-900">
            Taejae Wellness Community
          </h1>
          <p className="text-emerald-700 max-w-2xl mx-auto">
            Share your thoughts and experiences about wellness
            challenges facing our 3rd Cohort. Your voice
            matters. Your feedback can be submitted anonymously.
          </p>
          <p className="text-emerald-600 text-sm mt-2 max-w-2xl mx-auto">
            If you have difficulty communicating in English, you
            may write in your native language.
          </p>
        </div>

        {/* Main Content */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList
            className={`grid w-full ${isUnlocked ? "grid-cols-3" : "grid-cols-2"} bg-white/60 border border-emerald-200`}
          >
            <TabsTrigger
              value="share"
              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
            >
              <Heart className="w-4 h-4 mr-2" />
              Share Your Voice
            </TabsTrigger>
            <TabsTrigger
              value="community"
              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
              onClick={handleCommunityClick}
            >
              <Users className="w-4 h-4 mr-2" />
              Community Voices ({publicFeedbacks.length})
            </TabsTrigger>
            {isUnlocked && (
              <TabsTrigger
                value="secret"
                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
              >
                <Lock className="w-4 h-4 mr-2" />
                Secret Voices ({secretFeedbacks.length})
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="share" className="space-y-4">
            <div className="bg-white rounded-lg shadow-md border border-emerald-100 p-6">
              <FeedbackForm onSubmit={handleSubmitFeedback} />
            </div>
            <p className="text-xs text-center text-emerald-600">
              You can choose to submit anonymously or with your
              name.
            </p>
          </TabsContent>

          <TabsContent value="community" className="space-y-4">
            <div className="bg-white/60 rounded-lg border border-emerald-100 p-6">
              {isLoading ? (
                <div className="text-center py-12">
                  <p className="text-emerald-600">
                    Loading feedbacks...
                  </p>
                </div>
              ) : (
                <FeedbackList feedbacks={publicFeedbacks} />
              )}
            </div>
          </TabsContent>

          {isUnlocked && (
            <TabsContent value="secret" className="space-y-4">
              <div className="bg-white/60 rounded-lg border border-emerald-100 p-6">
                <div className="mb-4 flex items-center gap-2 text-emerald-700">
                  <Lock className="w-4 h-4" />
                  <span className="text-sm">
                    Admin View - Secret Messages
                  </span>
                </div>
                {isLoading ? (
                  <div className="text-center py-12">
                    <p className="text-emerald-600">
                      Loading secret messages...
                    </p>
                  </div>
                ) : (
                  <FeedbackList feedbacks={secretFeedbacks} />
                )}
              </div>
            </TabsContent>
          )}
        </Tabs>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-emerald-600">
          <p>Powered by Taejae Wellness Team</p>
        </div>
      </div>

      {/* Password Dialog */}
      <Dialog
        open={showPasswordDialog}
        onOpenChange={setShowPasswordDialog}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Admin Access</DialogTitle>
            <DialogDescription>
              Enter the password to access secret voices.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handlePasswordSubmit();
                }
              }}
              className="border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowPasswordDialog(false);
                  setPassword("");
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handlePasswordSubmit}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Unlock
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}