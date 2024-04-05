import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Avatar,
} from "@nextui-org/react";
import { Business } from "@prisma/client";
import { X } from "lucide-react";
import { createCheckoutSession } from "@/lib/stripe";

export default function PreviewModal({
  formId,
  isOpen,
  business,
  formVersion,
  onOpenChange,
  formContent,
}: {
  formId: string;
  isOpen: boolean;
  business: Business;
  formVersion: number;
  onOpenChange: () => void;
  formContent: JSX.Element;
}) {
  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="full"
        hideCloseButton
        scrollBehavior="inside"
        // backdrop="blur"
      >
        <ModalContent className="min-h-screen">
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
                      <p className="text-sm">
                        BOIR Version {formVersion} <b>Preview</b>
                      </p>
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
              <ModalBody>{formContent}</ModalBody>
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
    </>
  );
}
