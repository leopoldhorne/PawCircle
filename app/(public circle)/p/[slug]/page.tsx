import { Metadata } from "next";
import PublicCircle from "@/components/public-circle/PublicCircle";
import { supabaseAdmin } from "@/server/db/supabase-admin";

const APP_URL = process.env.NEXT_PUBLIC_BASE_URL

const fetchCircle = async (slug: string): Promise<CircleAndPet | null> => {
  const { data, error } = await supabaseAdmin
    .from("pets")
    .select("*, circles(*), users_pets(user_id)")
    .eq("slug", slug);

  if (error) {
    throw new Error("UNABLE TO FIND PAGGE");
  }

  if (!data) {
    return null;
  }

  const petInfo = Object.fromEntries(
    Object.entries(data[0]).filter(
      ([key, value]) => typeof value === "string" || typeof value === "number"
    )
  ); // idk tbh but it works to filter object into just pet

  const circleInfo = data![0].circles[0];

  const userId = data[0].users_pets[0].user_id;

  const info = { circleInfo: circleInfo, petInfo: petInfo, userId: userId };

  return info;
};

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const {slug} = await params
  const info = await fetchCircle(slug);

  if (!info) {
    return {
      title: "PawCircle",
      description: "Build your pet's village.",
    };
  }
  const circleInfo = info?.circleInfo;
  const petInfo = info?.petInfo;
  const userId = info?.userId;

  const ogUrl = new URL("/api/og/og-circle", APP_URL);
  ogUrl.searchParams.set("petName", petInfo.name);
  ogUrl.searchParams.set("blurb", circleInfo.blurb);
  ogUrl.searchParams.set("image", circleInfo.profile_image_url);

  return {
    title: `${petInfo.name[0].toUpperCase() + petInfo.name.slice(1)}'s Public Circle`,
    description: circleInfo.blurb,
    openGraph: {
      title: `${petInfo.name[0].toUpperCase() + petInfo.name.slice(1)}'s Public Circle`,
      description: circleInfo.blurb,
      url: `${APP_URL}/p/${slug}`,
      siteName: "PawCircle",
      images: [
        {
          url: ogUrl.toString(),
          height: 1200,
          width: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${petInfo.name[0].toUpperCase() + petInfo.name.slice(1)}'s Public Circle`,
      description: circleInfo.blurb,
      images: [ogUrl.toString()],
    }
  };
}

interface CircleAndPet {
  circleInfo: any;
  petInfo: any;
  userId: any;
}

interface PageParams {
    params: Promise<{ slug: string }>;
}


const Page = async ({params}: PageParams) => {
  const { slug } = await params
  return (
   <PublicCircle slug={slug}/>
  );
};
export default Page;
