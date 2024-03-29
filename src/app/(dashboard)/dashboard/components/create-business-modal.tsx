"use client";

import { createBusiness } from "@/lib/actions";
import { UploadButton } from "@/utils/uploadthing";
import {
  Avatar,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { Add } from "iconsax-react";
import { useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { ClientUploadedFileData } from "uploadthing/types";

const initialState = {
  created: false,
  business: null,
  errors: {},
};

export function CreateBusinessModal() {
  const logoUrlRef = useRef<HTMLInputElement>(null);
  const [businessLogo, setBusinessLogo] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [state, formAction] = useFormState<any, any>(
    createBusiness,
    initialState,
  );

  useEffect(() => {
    if (state.created) {
      onOpenChange();
      setBusinessLogo("");
    }
  }, [state.created, state.business?.id]);

  // useEffect(() => {
  //   console.log(state);
  // }, [state]);

  const handleClientUploadComplete = (res: ClientUploadedFileData<null>[]) => {
    const logoURL = res[0].url;

    if (logoUrlRef && logoUrlRef.current) {
      setBusinessLogo(logoURL);
      logoUrlRef.current.value = logoURL;
    }
  };

  return (
    <>
      <div onClick={onOpen}>
        <div className="h-full cursor-pointer rounded-xl border border-dashed border-[#F59E0B] bg-[#f59f0b30] px-5 py-8 transition-all duration-1000 hover:border-solid">
          <Add
            size="100"
            color="#F59E0B"
            className="mx-auto mb-4 block h-16 w-16"
          />
          <div className="space-y-2 text-center">
            <h2 className="text-xl font-semibold">Create a Business</h2>
            <p className="text-balance text-sm">
              Create a Business to manage eFiling with our help
            </p>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        size="lg"
      >
        <ModalContent>
          {(onClose) => (
            <form action={formAction}>
              <ModalHeader className="flex flex-col gap-1">
                Create a Business
              </ModalHeader>
              <ModalBody className="space-y-10">
                <span>Business Logo</span>
                <input type="hidden" name="logoUrl" ref={logoUrlRef} />
                <div className="!mt-0 flex items-center gap-5">
                  <Avatar
                    src={businessLogo}
                    className="h-20 w-20 !rounded-md !bg-transparent text-large"
                  />
                  <UploadButton
                    endpoint="imageUploader"
                    onClientUploadComplete={handleClientUploadComplete}
                    onUploadError={(error: Error) => {
                      alert(`ERROR! ${error.message}`);
                    }}
                    className="w-fit items-center"
                  />
                </div>

                <Input
                  type="text"
                  label="Business Name"
                  placeholder="Enter business name"
                  labelPlacement="outside"
                  variant="flat"
                  size="lg"
                  radius="sm"
                  name="businessName"
                />
                <Input
                  type="text"
                  label="Business description"
                  placeholder="Enter business info"
                  labelPlacement="outside"
                  variant="flat"
                  size="lg"
                  radius="sm"
                  name="businessDescription"
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Submit />
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

function Submit() {
  const { pending } = useFormStatus();

  return (
    <Button color="primary" type="submit" isLoading={pending}>
      Create Business
    </Button>
  );
}
