"use client";

import { createForm } from "@/lib/actions";
import { Button } from "@nextui-org/react";
import { Add } from "iconsax-react";
import { revalidatePath } from "next/cache";
import { useRouter } from "next/navigation";
import { useState } from "react";

const NewBoir = ({ businessId }: { businessId: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { push } = useRouter();

  const handleNewBoir = async () => {
    try {
      setIsLoading(true);
      await createForm({ businessId });
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      startContent={isLoading ? null : <Add />}
      onPress={handleNewBoir}
      isLoading={isLoading}
    >
      New BOIR
    </Button>
  );
};

export default NewBoir;
