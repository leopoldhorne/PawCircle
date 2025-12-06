"use client";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/app/context/AuthContext";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import Image from "next/image";
import { useEffect, useState } from "react";
import EditCircleForm from "@/components/edit-profile/EditCircleForm";
import EditImagesForm from "@/components/edit-profile/EditImagesForm";
import { useRouter } from "next/navigation";
import EditSkeleton from "@/components/edit-profile/EditSkeleton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import EditPrompt from "@/components/edit-profile/EditPrompt";

const Page = () => {
  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(true);
  const [openEdit, setOpenEdit] = useState<number>(0);
  const [openPrompt, setOpenPrompt] = useState<number>(0);
  const router = useRouter();
  const { user, pet, circleData, isLoadingCircleData } = useAuth();
  const circles = [
    {
      title: "Tagline",
      info: circleData?.tagline ? circleData.tagline : `Click here to edit`,
    },
    {
      title: "Blurb",
      info: circleData?.blurb ? circleData.blurb : `Click here to edit`,
    },
    {
      title: "Gift Blurb",
      info: circleData?.support_blurb
        ? circleData.support_blurb
        : `Click here to edit`,
    },
    {
      title: "Left Image",
      info: circleData?.image_1_url ? circleData.image_1_url : null,
      image: true,
      prompt: circleData?.image_1_prompt ? circleData.image_1_prompt : null,
      prompt_num: 1,
    },
    {
      title: "Center Image",
      info: circleData?.image_2_url ? circleData.image_2_url : null,
      image: true,
      prompt: circleData?.image_2_prompt ? circleData.image_2_prompt : null,
      prompt_num: 2,
    },
    {
      title: "Right Image",
      info: circleData?.image_3_url ? circleData.image_3_url : null,
      image: true,
      prompt: circleData?.image_3_prompt ? circleData.image_3_prompt : null,
      prompt_num: 3,
    },
  ];

  useEffect(() => {
    if (!isLoadingCircleData) {
      setIsLoadingPage(false);
    }
  }, [isLoadingCircleData]);

  return (
    <main className="bg-purple-50 min-h-screen">
      <div className="wrapper max-w-6xl mx-auto px-2 py-2 flex justify-center">
        <EditPrompt openPrompt={openPrompt} setOpenPrompt={setOpenPrompt}/>
        <EditCircleForm openEdit={openEdit} setOpenEdit={setOpenEdit} />
        <EditImagesForm openEdit={openEdit} setOpenEdit={setOpenEdit} />
        <Card className="w-full h-fit sm:max-w-md items-center font-bold px-3 justify-between">
          {isLoadingPage ? (
            <EditSkeleton />
          ) : (
            <>
              <div
                onClick={() => router.push("/c/dashboard")}
                className="w-full flex cursor-pointer items-center justify-between"
              >
                <p>
                  <FontAwesomeIcon icon={faArrowLeft} />
                </p>
                <p>Edit Public Circle</p>
                <p></p> {/*  empty on purpose for style reasons*/}
              </div>
              <Table className="max-w-full h-full">
                <TableBody className="">
                  <TableRow className="cursor-pointer">
                    <TableCell>Profile Photo</TableCell>
                    <TableCell
                      onClick={() => setOpenEdit(1)}
                      className="h-20 flex flex-wrap justify-center"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-full overflow-hidden bg-gray-100 flex items-center">
                          {circleData?.profile_image_url ? (
                            <Image
                              src={circleData.profile_image_url}
                              alt="profile image"
                              width={80}
                              height={80}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-sm text-gray-600 font-normal text-center">
                              Upload Image
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                  {circles.map((circle, index) => (
                    <TableRow
                      key={index}
                      onClick={() => console.log(circle.title)}
                      className="cursor-pointer"
                    >
                      <TableCell className="whitespace-nowrap" onClick={() => {
                        if (circle.image) {
                          setOpenPrompt(circle.prompt_num)
                        }
                      }}>
                        {circle.image ? (
                          <>
                            {" "}
                            <div>Image Prompt:</div>
                            <div className="w-full">
                              <p className="w-40 h-30 wrap-break-word whitespace-normal overflow-clip font-normal">{circle.prompt ? circle.prompt : "Click here to select" }</p>
                            </div>
                          </>
                        ) : (
                          <div>{circle.title}</div>
                        )}
                      </TableCell>
                      <TableCell
                        onClick={() => setOpenEdit(index + 2)}
                        className={`font-medium ${circle.image && "h-30"}`}
                      >
                        {circle.image ? (
                          <div className=" mx-auto w-40 h-40 rounded-xl border border-gray-300 overflow-hidden cursor-pointer bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                            {circle.info ? (
                              <img
                                src={circle.info}
                                alt="Preview"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-sm text-gray-600">
                                Upload Image
                              </span>
                            )}
                          </div>
                        ) : (
                          circle.info
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </Card>
      </div>
    </main>
  );
};
export default Page;
