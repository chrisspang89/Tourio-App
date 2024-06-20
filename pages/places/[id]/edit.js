import { useRouter } from "next/router";
import Link from "next/link";
import useSWR from "swr";
import Form from "../../../components/Form.js";
import { StyledLink } from "../../../components/StyledLink.js";

export default function EditPage() {
  const router = useRouter();
  const {
    isReady,
    query: { id },
  } = router;
  const { data: place, error: placeError } = useSWR(
    id ? `/api/places/${id}` : null
  );

  async function editPlace(updatedPlace) {
    try {
      const response = await fetch(`/api/places/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedPlace),
      });

      if (!response.ok) {
        throw new Error(`Failed to edit place: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Place successfully edited:", data);
      router.push(`/places/${id}`);
    } catch (error) {
      console.error("Failed to edit place:", error);
    }
  }

  if (!isReady || !id || !place || placeError) return <h2>Loading...</h2>;

  return (
    <>
      <h2 id="edit-place">Edit Place</h2>
      <Link href={`/places/${id}`} passHref>
        <StyledLink $justifySelf="start">Back</StyledLink>
      </Link>
      <Form onSubmit={editPlace} formName="edit-place" defaultData={place} />
    </>
  );
}
