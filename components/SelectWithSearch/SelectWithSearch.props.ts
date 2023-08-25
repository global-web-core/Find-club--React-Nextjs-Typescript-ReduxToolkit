import { DetailedHTMLProps, HTMLAttributes} from 'react';
import { AdditionalInterface } from '../../typesAndInterfaces/interfaces';

export interface SelectWithSearchProps extends Omit<DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>, "onChange" | "defaultValue"> {
	placeholder: string;
	options: {value: string; label: string;}[];
	name: string;
	defaultValue: string | null;
	onChange: ({ name, value }: AdditionalInterface.SelectValue) => void;
}