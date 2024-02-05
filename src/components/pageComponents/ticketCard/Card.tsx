"use client";
import { useState } from "react";
import LoginTip from "./loginTip/LoginTip";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// Import React FilePond
import { FilePond, registerPlugin } from "react-filepond";

// Import FilePond styles
import "filepond/dist/filepond.min.css";

// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
// `npm i filepond-plugin-image-preview filepond-plugin-image-exif-orientation --save`
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import LoadingOverlay from "../hero/LoadingOverlay";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const schema = z.object({
  projectId: z.string().min(1),
  name: z.string().min(1),
  email: z.string().min(1).email(),
});

export function CardForm() {
  const [projectId, setProjectId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [relevance, setRelevance] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [files, setFiles] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const formAction = async (e: any) => {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData();

    formData.append("projectId", projectId);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("description", description);
    formData.append("relevance", relevance);
    formData.append("message", message);

    for (const file of Array.from(files)) {
      formData.append("files", file);
    }

    const res = await fetch("api/issues", {
      method: "POST",
      // headers: {
      //   "Content-Type": "application/json",
      // },
      body: formData,
    });

    setLoading(false);

    const { msg } = await res.json();
    setMessage(msg); // Set the message based on the response

    if (res.ok) {
      setMessage("Form submitted successfully!"); // Success message
    } else {
      setMessage("Error submitting form"); // Error message
    }

    setProjectId("");
    setName("");
    setDescription("");
    setRelevance("");
    setEmail("");
  };
  return (
    <>
      <div className="flex flex-col">
        <div className="mb-5">
          <LoginTip />
        </div>
        {loading && <LoadingOverlay />}
        <Card className="w-full md:w-[500px] mx-2">
          <CardHeader>
            {message && (
              <div
                className={`${
                  message === "Form submitted successfully!"
                    ? "bg-green-500 text-white bg-opacity-40 border-2 border-green-500 p-3 mb-5 opacity-90"
                    : "bg-red-500 text-white bg-opacity-40 border 2 border-red-500 p-3 mb-5 opacity-90"
                } p-2 rounded-md`}
              >
                {message}
              </div>
            )}
            <CardTitle>Report your Issue</CardTitle>
            <CardDescription>
              Tell me if you have a problem on your project
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="client">ProjectID</Label>
                  <Input
                    {...register("projectId")}
                    id="projectId"
                    type="number"
                    placeholder="ID of your project"
                    onChange={(e) => setProjectId(e.target.value)}
                    value={projectId}
                  />
                  {errors?.projectId && (
                    <p className="text-red-600">{errors?.projectId?.message?.toString()}</p>
                  )}
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    {...register("name")}
                    id="name"
                    placeholder="Name of your project"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                  />
                  {errors?.name && (
                    <p className="text-red-600">
                      {errors?.name?.message?.toString()}
                    </p>
                  )}
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Email of the Recipiant</Label>
                  <Input
                    {...register("email")}
                    id="email"
                    placeholder="Enter the Email of your recipiant"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                  {errors?.email && (
                    <p className="text-red-600">
                      {errors?.email?.message?.toString()}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Type your message here."
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="relevance">Relevance</Label>
                  <Select 
                    onValueChange={(value) => setRelevance(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="critical">critical</SelectItem>
                      <SelectItem value="major">Major</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="minor">Minor</SelectItem>
                      <SelectItem value="trivial">Trivial</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors?.relevance && (
                    <p className="text-red-600">
                      {errors?.relevance?.message?.toString()}
                    </p>
                  )}
                </div>
              </div>
            </form>
            <FilePond
              className="mt-3"
              files={files}
              name="files"
              allowReorder={true}
              allowMultiple={true}
              onupdatefiles={(fileItems) => {
                setFiles(fileItems.map((fileItem) => fileItem.file as File));
              }}
              labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              className="w-full"
              type="submit"
              onClick={handleSubmit(formAction)}
            >
              Report Issue
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

export default CardForm;
