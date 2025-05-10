import { Note, NoteSchema } from "../model";

export const handlerC = (data: unknown) => {
  if (NoteSchema.safeParse(data).success) {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Valid Note" }),
    };
  }

  return {
    statusCode: 400,
    body: JSON.stringify({
      message: `Invalid Note: ${NoteSchema.safeParse(data)
        .error?.issues.map((issue) => issue.message)
        .join(", ")}`,
    }),
  };
};

const notes: (Note | unknown)[] = [
  {
    "id": "1",
    "title": "Note 1",
    "content": "This is the first note and it's valid."
  },
  {
    "id": "2",
    "content": "This is the second note and it's not valid."
  },
  {
    "id": "3",
    "title": "Note 3"
  },
];

const results = notes.map((note) => handlerC(note));

for (const result of results) {
  console.log(result);
}
