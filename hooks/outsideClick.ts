import { RefObject, useEffect } from "react";

export const useOutsideClick = (ref: RefObject<HTMLSelectElement>, clickOutside: TypeClickOutside) => {
	useEffect(() => {
		function handleClickOutside(event: Event) {
			if (ref.current && !ref.current.contains(event.target as Node)) clickOutside();
		}
		document.addEventListener("mousedown", handleClickOutside);
		
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [ref]);
}

type TypeClickOutside = () => void