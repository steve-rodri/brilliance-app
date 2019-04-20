import styled from 'styled-components';

export const Arrow = styled.button`
	appearance: none;
	user-select: none;
	outline: none !important;
	display: inline-block;
	position: relative;
	cursor: pointer;
	padding: 0;
	border: none;
	border-top: 10px solid var(--dark-gray);
	border-bottom: 10px solid var(--dark-gray);
	transition: all 250ms ease-out;
`;

export const ArrowLeft = styled(Arrow)`
	border-right: 15px solid #ccc;
	left: .5rem;
	:hover {
		border-right-color: var(--turquoise);
	}
`;

export const ArrowRight = styled(Arrow)`
	border-left: 15px solid #ccc;
	right: .5rem;
	:hover {
		border-left-color: var(--turquoise);
	}
`;

export const CalendarContainer = styled.div`
	font-size: 5px;
	/* border: 2px solid var(--med-dark-blue); */
	border-radius: 5px;
	overflow: hidden;
`;

export const CalendarHeader = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

export const CalendarGrid = styled.div`
  display: grid;
  grid-template: repeat(7, auto) / repeat(7, auto);
`;

export const CalendarMonth = styled.div`
	font-weight: 500;
	font-size: 4em;
	color: var(--light-gray);
	text-align: center;
	padding: 0.5em 0.25em;
	word-spacing: 5px;
	user-select: none;
`;

export const CalendarCell = styled.div`
	text-align: center;
	align-self: center;
	padding: 0.2em 0.2em;
	user-select: none;
  grid-column: ${props => (props.index % 7) + 1} / span 1;
`;

export const CalendarDay = styled(CalendarCell)`
	font-weight: 600;
	font-size: 2.25em;
	color: var(--light-gray);
	border-bottom: 1px solid var(--light-gray);
	margin-bottom: 5px;
`;
// border-top: 2px solid var(--med-dark-blue);
// border-bottom: 2px solid var(--med-dark-blue);
// border-right: ${props => (props.index % 7) + 1 === 7 ? `none` : `2px solid var(--med-dark-blue)`};

export const CalendarDate = styled(CalendarCell)`
	font-weight: ${props => props.inMonth ? 500 : 300};
	font-size: 3.75em;
	cursor: pointer;
	color: ${props => props.inMonth ? `#ccc` : `#666`};
  grid-row: ${props => Math.floor(props.index / 7) + 2} / span 1;
	transition: all 500ms ease-out;
	border: 2px solid transparent;
	:hover {
		color: #fff;
		border-color: ${props => props.inMonth ? `#ccc`: `#666`}
	}
`;
// border-bottom: ${props => ((props.index + 1) / 7) <= 5 ? `1px solid #ddd` : `none`};
// border-right: ${props => (props.index % 7) + 1 === 7 ? `none` : `1px solid #ddd`};
// background: rgba(0, 102, 204, 0.075);

export const HighlightedCalendarDate = styled(CalendarDate)`
	color: #fff !important;
	background: var(--med-dark-blue) !important;
	position: relative;
	::before {
		content: '';
		position: absolute;
		top: -1px;
		left: -1px;
		width: calc(100% + 2px);
		height: calc(100% + 2px);
	}
`;
// border: 2px solid var(--med-dark-blue);

export const TodayCalendarDate = styled(HighlightedCalendarDate)`
	color: var(--turquoise) !important;
	background: transparent !important;
	font-weight: 900;
	::after {
		content: '';
		position: absolute;
		right: 0;
		bottom: 0;
		border-bottom: 0.5em solid var(--turquoise);
		border-left: 0.5em solid transparent;
		border-top: 0.5em solid transparent;
	}
	:hover {
		color: #fff !important;
	}
`;
// border-bottom: 0.5em solid var(--turquoise);
// border-left: 0.5em solid transparent;
// border-top: 0.5em solid transparent;
// background: rgba(0, 102, 204, 0.075) !important;
