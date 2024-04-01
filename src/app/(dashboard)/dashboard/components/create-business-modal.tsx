"use client";

import FormDate from "@/components/form-date";
import FormInput from "@/components/form-input";
import FormSelect from "@/components/form-select";
import { createBusiness } from "@/lib/actions";
import { cn } from "@/lib/utils";
import { businessEntityTypes } from "@/utils/constants";
import { UploadDropzone } from "@/utils/uploadthing";
import { businessCreationValidation } from "@/utils/validations";
import {
  Avatar,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import { useFormik } from "formik";
import { Add } from "iconsax-react";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { ClientUploadedFileData } from "uploadthing/types";

const initialState = {
  created: false,
  business: null,
  errors: {},
};

export function CreateBusinessModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const {
    isOpen: excemptPromptOpen,
    onOpen: excemptPromptOnOpen,
    onOpenChange: excemptPromptOnOpenChange,
  } = useDisclosure();

  const businessCreationInfo = useFormik({
    initialValues: {
      businessName: "",
      businessLogo: "",
      businessDescription: "",
      businessCreationDate: "",
      businessEntityType: "",
    },
    validationSchema: businessCreationValidation,
    onSubmit: async (values) => {
      const { business, errors } = await createBusiness({
        name: values.businessName,
        logo: values.businessLogo,
        entityType: values.businessEntityType,
        description: values.businessDescription,
        creationDate: new Date(values.businessCreationDate),
      });

      if (errors) {
        console.log(errors);
      } else {
        businessCreationInfo.resetForm();
        console.log(business);
        onOpenChange();
      }
    },
  });

  useEffect(() => {
    businessCreationInfo.resetForm();
  }, [isOpen]);

  const formError = businessCreationInfo.errors;
  const formTouched = businessCreationInfo.touched;

  const handleClientUploadComplete = (res: ClientUploadedFileData<null>[]) => {
    const logoURL = res[0].url;
    businessCreationInfo.setFieldValue("businessLogo", logoURL);
    setIsUploadingLogo(false);
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
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <form>
              <ModalHeader className="flex flex-col gap-1">
                Create a Business
              </ModalHeader>
              <ModalBody className="space-y-2">
                <span>Business Logo</span>
                <div className="relative !mt-0 flex items-center gap-5">
                  {businessCreationInfo.values.businessLogo ? (
                    <div className="group relative">
                      <div
                        className={cn(
                          "absolute -right-2 -top-2 z-50 cursor-pointer rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100",
                        )}
                        onClick={() => {
                          businessCreationInfo.setFieldValue(
                            "businessLogo",
                            "",
                          );
                        }}
                      >
                        <X className="h-4 w-4" />
                      </div>
                      <Avatar
                        src={businessCreationInfo.values.businessLogo}
                        className="h-20 w-20 !rounded-md !bg-transparent text-large"
                      />
                    </div>
                  ) : (
                    <div className="relative">
                      <UploadDropzone
                        endpoint="imageUploader"
                        config={{ mode: "auto" }}
                        onClientUploadComplete={handleClientUploadComplete}
                        onUploadError={(error: Error) => {
                          alert(`ERROR! ${error.message}`);
                          setIsUploadingLogo(false);
                        }}
                        onUploadBegin={() => setIsUploadingLogo(true)}
                        className="peer mt-0 h-20 w-20 cursor-pointer ut-label:hidden ut-uploading:animate-pulse"
                      />
                      <Spinner
                        className={cn(
                          "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform",
                          { hidden: !isUploadingLogo },
                        )}
                        size="sm"
                      />
                    </div>
                  )}
                </div>
                <FormInput
                  label="Business Name"
                  placeholder="Enter business name"
                  {...businessCreationInfo.getFieldProps("businessName")}
                  isRequired
                  isInvalid={
                    formTouched.businessName && !!formError.businessName
                  }
                  errorMessage={
                    formTouched.businessName && formError.businessName
                  }
                />
                <FormInput
                  label="Business description"
                  placeholder="Enter business info"
                  {...businessCreationInfo.getFieldProps("businessDescription")}
                />
                <div>
                  <FormDate
                    isRequired
                    label="Business Creation Date"
                    placeholder="01/01/2024"
                    setFieldValue={businessCreationInfo.setFieldValue}
                    {...businessCreationInfo.getFieldProps(
                      "businessCreationDate",
                    )}
                    isInvalid={
                      formTouched.businessCreationDate &&
                      !!formError.businessCreationDate
                    }
                    errorMessage={
                      formTouched.businessCreationDate &&
                      formError.businessCreationDate
                    }
                  />
                </div>
                <FormSelect
                  listContent={businessEntityTypes}
                  label="Business entity type"
                  placeholder="Select business entity type"
                  name="businessEntityType"
                  setFieldValue={(field, value) => {
                    businessCreationInfo.setFieldValue(field, value);
                    if (value && value !== "other") excemptPromptOnOpen();
                  }}
                  isRequired
                  isInvalid={
                    formTouched.businessEntityType &&
                    !!formError.businessEntityType
                  }
                  errorMessage={
                    formTouched.businessEntityType &&
                    formError.businessEntityType
                  }
                />
              </ModalBody>
              <ModalFooter>
                <ExcemptPrompt
                  isOpen={excemptPromptOpen}
                  onOpenChange={excemptPromptOnOpenChange}
                  entityType={businessCreationInfo.values.businessEntityType}
                />
                <Button
                  color="danger"
                  variant="light"
                  type="button"
                  onPress={onClose}
                >
                  Close
                </Button>
                <Button
                  color="primary"
                  type="button"
                  isLoading={businessCreationInfo.isSubmitting}
                  onPress={() => businessCreationInfo.handleSubmit()}
                >
                  Create Business
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

function ExcemptPrompt({
  entityType,
  isOpen,
  onOpenChange,
}: {
  entityType: string;
  isOpen: boolean;
  onOpenChange: () => void;
}) {
  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Did you know?
              </ModalHeader>
              <ModalBody>
                <p>
                  <b>
                    {entityType.endsWith("y")
                      ? entityType.slice(0, -1) + "ies"
                      : entityType + "s"}
                  </b>{" "}
                  are exempt from filing BOI Reports? Based on the guidance
                  given by FinCEN and your stated business entity type, you
                  don&apos;t need to file a BOI Report!
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
