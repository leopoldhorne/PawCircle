"use client";
import { Card } from "@/components/ui/card";
import { useAuth, UserData } from "@/app/context/AuthContext";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import Image from "next/image";
import { useEffect, useState } from "react";
import EditCircleForm from "@/components/edit-profile/EditCircleForm";
import EditImagesForm from "@/components/edit-profile/EditImagesForm";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAlarmClock, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/server/db/supabase-client";
import { userAgent } from "next/server";
import { Url } from "url";

const fetchBalances = async (userId: string) => {
  const { data, error } = await supabase.from("gifts").select("*").eq("user_id", userId)

  if (error) {
    console.log("ERROR PULLING BALANCE")
    throw new Error(error.message)
  }

  if (!data) {
    return null
  }

  const availableBalance = data.filter((elem) => elem.status === "available").map((elem) => elem.creator_earnings_cents).reduce((acc, curr) => acc + curr, null)
  const pendingBalance = data.filter((elem) => elem.status === "pending").map((elem) => elem.creator_earnings_cents).reduce((acc, curr) => acc + curr, null)

  const balances = {
    available: availableBalance,
    pending: pendingBalance,
  }

  return balances
}
const createStripeAccount = async (userData: UserData) => {
  const response = await fetch("/api/create-stripe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ userData })
  })

  if (!response.ok) {
    console.log("CREATE STRIPE ERROR CLIENT")
    throw new Error("CREATE STRIPE ERROR CLIENT")
  }

}

interface onboardLinkResponse {
  onboardingUrl: string,
  status: number,
}

interface onboardLinkError {
  error: string,
  status: number,
}


const onboardLink = async (userData: UserData): Promise<onboardLinkResponse>  =>  {
  const response = await fetch("/api/onboard-stripe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      userData
    })
  })

   if (!response.ok) {
    console.log("ERROR GETTING LINK CLIENT")
    throw new Error("ERROR GETTING LINK CLIENT")
  }

  return response.json()
}

interface dashboardResponse {
  url: string,
}

const dashboardLink = async (userData: UserData): Promise<dashboardResponse> => {
  const response = await fetch("/api/dashboard-link", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({userData})
  })

  return response.json()
}

const withdrawMoney = async (userData: UserData) => {
  const response = await fetch("/api/withdraw-stripe", {
    method: "POST",
    headers: {
      "Content-Type":"application/json"
    },
    body: JSON.stringify({userData})
  })

  if (!response.ok) {
    const error = await response.json()
    console.log(error)
    throw new Error("ERROR WITHDRAW")
  }

  return response.json()
}

const Page = () => {
  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(true);
  const router = useRouter();
  const [onboardPopup, setOnboardPopup] = useState<boolean>(false)
  const { user, userData, isLoadingCircleData } = useAuth();
  const queryClient = useQueryClient()
  
  const { data: balances, isLoading: isLoadingPendingBalance } = useQuery({
    queryKey: ["balances", user?.id!],
    enabled: !!user && !!userData,
    queryFn: () => fetchBalances(userData?.id!)
  })

  const {mutate: createStripe} = useMutation({
    mutationFn: () => createStripeAccount(userData!),
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: ["userData", user?.id],
      })
      onBoard()
    }
  }) 

  const { mutate: onBoard } = useMutation<onboardLinkResponse>({
    mutationFn: () => onboardLink(userData!),
    onSuccess: (data) => {
      window.location.href = data.onboardingUrl
    },
  })

  const { mutate: getDashboard } = useMutation<dashboardResponse>({
    mutationFn: () => dashboardLink(userData!),
    onSuccess: (data) => {
      window.location.href = data.url
    }
  })

  const { mutate: withdraw } = useMutation({
    mutationFn: () => withdrawMoney(userData!),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["balances", user?.id!],
      })
    }
  })

  const handleOnboarding = () => {
    if (!userData) {
      return
    }

    if (userData?.stripe_account_id) {
      onBoard()
    } else {
      createStripe()
    }
  }

  const handleDashboard = () => {
    if (!userData?.stripe_account_id) {
      return
    }

    getDashboard()
  } 

  const handleWithdraw = async () => {
    if (!userData) return
    if (userData?.stripe_payouts_enabled === false) return
    withdraw()
  }

  useEffect(() => {
    if (!isLoadingCircleData && !isLoadingPendingBalance) {
      setIsLoadingPage(false);
    }
  }, [isLoadingCircleData, isLoadingPendingBalance]);

  useEffect(() => {
    if (userData?.stripe_payouts_enabled === false) {
      setOnboardPopup(true)
    }
  }, [userData])

  return (
    <main className="bg-purple-50 min-h-screen">
      <div className="wrapper max-w-6xl mx-auto px-2 py-2 flex justify-center">
        <Card className="w-full h-fit sm:max-w-md items-center font-bold px-3 justify-between">
          <>
            <div
              onClick={() => router.push("/c/dashboard")}
              className="w-full flex cursor-pointer items-center justify-between"
            >
              <p>
                <FontAwesomeIcon icon={faArrowLeft} />
              </p>
              <p>Earnings</p>
              <p></p>
              {/*  empty on purpose for style reasons*/}
            </div>
            <div className={`${onboardPopup ? "flex" : "hidden"} border-3 border-red-400 border-dashed bg-red-50 w-full flex-col items-center justify-center text-center gap-3 p-5`}>
              <p className="">
                <FontAwesomeIcon
                  icon={faAlarmClock}
                  className="text-red-600 mr-3"
                />
                <span>Complete your payout setup</span>
                <FontAwesomeIcon
                  icon={faAlarmClock}
                  className="text-red-600 ml-3"
                />
              </p>
              <p className="text-base font-normal">
                Finish setting up your account to withdraw earnings.
              </p>
              <Button onClick={() => handleOnboarding()} className="w-full cursor-pointer font-bold bg-red-400 hover:bg-red-400 border-2 border-black text-black">
                Complete Payout Setup
              </Button>
            </div>
            <Table className="max-w-full h-full">
              <TableBody className="">
                <TableRow className="cursor-pointer">
                  <TableCell className="text-center w-50 text-base">
                    Available Balance
                  </TableCell>
                  <TableCell className="h-auto flex flex-wrap justify-center">
                    <div className="flex justify-start w-full">
                      <p className="text-lg text-left">{balances ? (balances.available/100).toLocaleString("en-US", {style: "currency", currency: "USD"}) : "$0.00"}</p>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow className="cursor-pointer">
                  <TableCell className="text-center w-50 text-md">
                    Pending Balance
                  </TableCell>
                  <TableCell className="h-auto flex flex-wrap justify-center">
                    <div className="flex justify-start w-full">
                      <p className="text-base text-left text-gray-500">{balances ? (balances.pending/100).toLocaleString("en-US", {style: "currency", currency: "USD"}) : "$0.00"}</p>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Button onClick={() => handleWithdraw()} className="w-[90%] cursor-pointer font-bold">
              Withdraw to Stripe
            </Button>
            <Button onClick={() => handleDashboard()} className="w-[90%] cursor-pointer font-bold">
              Manage Payout Settings
            </Button>
          </>
        </Card>
      </div>
    </main>
  );
};
export default Page;
