// copied types from react-calendar if the library is updated then the types may broke
type Action = 'prev' | 'prev2' | 'next' | 'next2' | 'onChange' | 'drillUp' | 'drillDown';
type View = 'century' | 'decade' | 'year' | 'month';
type ValuePiece = Date | null;
type Range<T> = [T, T];
type Value = ValuePiece | Range<ValuePiece>;
type ValuePieceForRedux = string | null;
type ValueForRedux = ValuePieceForRedux | Range<ValuePieceForRedux>;

export interface EventActiveStartDateChange {
	action: Action;
  activeStartDate: Date | null;
  value: Value;
  view: View;
}

export interface EventActiveStartDateChangeForRedux {
	action: Action;
  activeStartDate: string | null;
  value: ValueForRedux;
  view: View;
}