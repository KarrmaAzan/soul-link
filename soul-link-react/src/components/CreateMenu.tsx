import { useRef, useEffect } from "react";

type CreateMenuProps = {
  // opens the moment creation modal
  onCreateMoment: () => void;

  // opens persona creation modal
  onCreatePersona: () => void;

  // closes the menu
  onClose: () => void;
};

function CreateMenu({ onCreateMoment, onCreatePersona, onClose }: CreateMenuProps) {

  // Reference to the menu element
  const menuRef = useRef<HTMLDivElement>(null);

  // Detect clicks outside the menu
  useEffect(() => {

    function handleClickOutside(event: MouseEvent) {

      // If the click target is not inside the menu
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        onClose();
      }

    }

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup listener when component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };

  }, [onClose]);

  return (

    <div className="action-menu" ref={menuRef}>

      <button onClick={onCreateMoment}>
        Create Moment
      </button>

      <button onClick={onCreatePersona}>
        Create Persona
      </button>

      <button>
        Go Live
      </button>

    </div>

  );

}

export default CreateMenu;
