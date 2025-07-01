import Heading from "@/components/converation/Heading"
import { SubscriptionButton } from "@/components/subscription-button"
import { checkSubscription } from "@/lib/subscirption"
import { Settings } from "lucide-react"



const SettingsPage = async () => {
    const isPro = await checkSubscription()
    const isProBool = Boolean(isPro);

    return(
        <div>
            <Heading
            title="Settings"
            description="Manage your account settings and preferences."
            icon={Settings}
            iconColor="text-gray-700"
            bgColor="bg-gray-700/10"

            
            />

            <div className="px-4 lg:px-8 space-y-4">
                <div className="text-muted-foreground text-sm">
{isProBool ? "Your are currently on a pro plan.":"You are currently on a free plan."}
                </div>
<SubscriptionButton isPro={isProBool}/>
            </div>
        </div>
    )
}
export default SettingsPage