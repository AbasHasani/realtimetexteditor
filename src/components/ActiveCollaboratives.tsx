import { useOthers } from "@liveblocks/react/suspense";
import Image from "next/image";

const ActiveCollaboratives = () => {
  const others = useOthers();
  const collaborators = others.map((other) => other.info);

  return (
    <ul className="collaborators-list">
      {collaborators.map(({ id, avatar, color, name }) => (
        <li key={id}>
          <Image
            src={avatar}
            width={100}
            height={100}
            alt="avatar"
            className="inline-block size-8 rounded-full ring-2 ring-dark-100"
          />
        </li>
      ))}
    </ul>
  );
};

export default ActiveCollaboratives;
