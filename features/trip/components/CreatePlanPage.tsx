"use client"

// import Navigation from "@/components/navigation"
import { ChevronRight } from "lucide-react"
import {useForm,FormProvider} from "react-hook-form"
import { useState } from "react"
import StepOne from "./create-steps/Step1Basic"
import StepTwo from "./create-steps/Step2Places"
import StepThree from "./create-steps/Step3Finalize"
import { tripSchema,TripSchemaType } from "../schema/tripSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { APIProvider } from "@vis.gl/react-google-maps"
import { createTrip } from "../api/createTrip"
import { toast } from "sonner"

const STEPS = [
  { number: 1, title: "Trip Info", description: "Basic details",fields: ["title", "startDate", "endDate"] as const},
  { number: 2, title: "Places", description: "Add locations", fields: ["places"] as const},
  { number: 3, title: "Share", description: "Finalize plan", fields: ["shareWithFriends", "syncCalendar"] as const},
]
const stepConfig = (stepNumber: number) => {
  return STEPS.find((step) => step.number === stepNumber);
};

export default function CreatePlanPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const methods = useForm({
    mode: "onChange",
    resolver: zodResolver(tripSchema),
    defaultValues: {
      title: "",
      startDate: "",
      endDate: "",
      places: [],
      shareWithFriends: false,
      syncCalendar: false,
    }
  });    
  const { handleSubmit, trigger } = methods;

  const handleNext = async () => {
    const step = stepConfig(currentStep);
    if (!step) return;
    
    // ステップごとにバリデーションを実行
    const isStepValid = await trigger(step.fields);
    if (isStepValid) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
    
  }
  



  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const onSubmit = async (data: TripSchemaType) => {
    setIsSubmitting(true);
    console.log("Submitting data:", data);
    try {
      const result = await createTrip(data);
      console.log("Result:", result);
      
      if (!result.success) {
        const errorMessage = typeof result.error === "string" 
          ? result.error 
          : "入力内容に誤りがあります";

        toast.error(errorMessage);
        setIsSubmitting(false);
        return;
      }
      
      toast.success("旅行プランが正常に作成されました！");
      
      // リダイレクト
        window.location.href = `/trips/new`;
      
      
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("予期せぬエラーが発生しました");
      setIsSubmitting(false);
    }
    // 成功時はリダイレクトするのでsetIsSubmittingは呼ばない
  }


  return (
    <FormProvider {...methods}>
    <div className="flex h-screen bg-background">
      {/* <Navigation /> */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b border-border p-6 bg-card">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-foreground mb-2">Create Travel Plan</h1>
            <p className="text-muted-foreground">Document your adventure step by step</p>
          </div>
        </header>

        {/* Step Indicator */}
        <div className="border-b border-border p-6 bg-card/50">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              {STEPS.map((step, idx) => (
                <div key={step.number} className="flex items-center gap-2 flex-1">
                  <div
                    className={`shrink-0 w-10 h-10 rounded-full font-semibold flex items-center justify-center transition-colors ${
                      currentStep === step.number
                        ? "bg-primary text-primary-foreground"
                        : currentStep > step.number
                          ? "bg-accent text-accent-foreground"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {currentStep > step.number ? "✓" : step.number}
                  </div>
                  <div className="hidden sm:block">
                    <p className="font-medium text-sm text-foreground">{step.title}</p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                  {idx < STEPS.length - 1 && (
                    <ChevronRight
                      className={`w-5 h-5 shrink-0 ${currentStep > step.number ? "text-accent" : "text-border"}`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 max-w-4xl mx-auto">
            <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""} >
              {currentStep === 1 && <StepOne/>}
              {currentStep === 2 && <StepTwo />}
              {currentStep === 3 && <StepThree />}
            </APIProvider>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-border p-6 bg-card flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="px-6 py-2 rounded-lg border border-border text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Previous
          </button>
          <div className="text-sm text-muted-foreground">
            Step {currentStep} of {STEPS.length}
          </div>
          <button
            onClick={currentStep === STEPS.length ? () => handleSubmit(onSubmit)() : handleNext}
            className="px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
            disabled={isSubmitting}
          >
            {currentStep === STEPS.length ? (isSubmitting ? "Creating..." : "Create Plan") : "Next"}
          </button>
        </div>
      </div>
    </div>
    </FormProvider>
  )
}
