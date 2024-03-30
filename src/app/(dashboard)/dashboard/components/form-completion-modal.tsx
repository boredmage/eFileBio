import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Avatar,
} from "@nextui-org/react";
import { X } from "lucide-react";
import { Business } from "@prisma/client";
import { createCheckoutSession } from "@/lib/stripe";

export default function FormCompletionModal({
  formId,
  isOpen,
  business,
  formVersion,
  onOpenChange,
}: {
  formId: string;
  isOpen: boolean;
  business: Business;
  formVersion: number;
  onOpenChange: () => void;
}) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="top-center"
      size="lg"
      backdrop="opaque"
      hideCloseButton
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col p-2">
              <div className="flex items-center justify-between rounded-xl border border-[#F5F5F5] bg-[#FAFAFA] p-3">
                <div className="flex w-fit gap-4">
                  <Avatar
                    src={business.logo ?? ""}
                    className="mx-auto !block h-12 w-12 !rounded-md !bg-transparent text-large"
                  />
                  <div>
                    <h2 className="text-xl font-semibold">{business.name}</h2>
                    <p className="text-sm">BOIR Version {formVersion}</p>
                  </div>
                </div>
                <Button
                  isIconOnly
                  aria-label="Like"
                  variant="flat"
                  className="h-12 w-12"
                  onClick={onClose}
                >
                  <X />
                </Button>
              </div>
            </ModalHeader>
            <ModalBody className="p-2">
              <img
                src="/document-reviewer.svg"
                alt="Document Reviewer"
                className="mx-auto block max-w-sm"
              />
              <p className="flex justify-between text-balance px-1 py-2 text-center text-2xl">
                Your BOIR form is ready to be filed with FinCEN
              </p>
            </ModalBody>
            <ModalFooter className="grid w-full grid-cols-2 p-4">
              <Button
                color="default"
                variant="flat"
                radius="full"
                className="text-[#737373]"
                size="lg"
                onClick={() =>
                  createCheckoutSession(
                    business.id,
                    formId,
                    "review-filling",
                  ).then((res) => {
                    // @ts-ignore
                    window.location.href = res.url;
                  })
                }
              >
                Expert Review before Filing
              </Button>
              <Button
                color="warning"
                radius="full"
                className="text-white"
                size="lg"
                onClick={() =>
                  createCheckoutSession(
                    business.id,
                    formId,
                    "direct-filling",
                  ).then((res) => {
                    // @ts-ignore
                    window.location.href = res.url;
                  })
                }
              >
                Pay with Stripe and File Now
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
