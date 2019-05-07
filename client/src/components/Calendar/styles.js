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
	height: 50px;
	width: 50px;
	background: transparent;
	color: var(--light-gray);
	transition: all 200ms ease-out;
`;

export const ArrowLeft = styled(Arrow)`
	:hover {
		border-right-color: #fff;
	}
`;

export const ArrowRight = styled(Arrow)`
	:hover {
		border-left-color: #fff;
	}
`;

export const CalendarContainer = styled.div`
	font-size: 5px;
	border-radius: 5px;
	overflow: hidden;
	width: 100%;
	height: 100%;
	display: grid;
	grid-template-rows: 50px auto;
`;

export const CalendarHeader = styled.div`
	display: grid;
	grid-auto-flow: column;
	align-items: center;
	height: 50px;
	justify-content: space-evenly;
`;

export const CalendarGrid = styled.div`
  display: grid;
  grid-template: .5fr repeat(6, 1fr) / repeat(7, auto);
`;

export const CalendarMonth = styled.div`
	font-weight: 500;
	font-size: 4em;
	font-family: 'Roboto', sans-serif;
	color: var(--light-gray);
	text-align: center;
	word-spacing: 5px;
	user-select: none;
	:hover {
		cursor: pointer;
	}
`;

export const CalendarCell = styled.div`
	text-align: center;
	align-self: center;
	height: 100%;
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	user-select: none;
  grid-column: ${props => (props.index % 7) + 1} / span 1;
`;

export const CalendarDay = styled(CalendarCell)`
	font-weight: 600;
	font-size: 2.25em;
	font-family: 'Roboto', sans-serif;
	color: var(--light-gray);
`;
// border-top: 2px solid var(--med-dark-blue);
// border-bottom: 2px solid var(--med-dark-blue);
// border-right: ${props => (props.index % 7) + 1 === 7 ? `none` : `2px solid var(--med-dark-blue)`};

export const CalendarDate = styled(CalendarCell)`
	font-weight: ${props => props.inMonth ? 500 : 300};
	font-size: 3.75em;
	font-family: 'Roboto', sans-serif;
	cursor: pointer;
	color: ${props => props.inMonth ? `#ccc` : `#666`};
  grid-row: ${props => Math.floor(props.index / 7) + 2} / span 1;
	transition: all 500ms ease-out;
	border: 2px solid transparent;
	:hover {
		color: ${props => props.inMonth ? `#fff`: `#999`}
	}
`;
// border-bottom: ${props => ((props.index + 1) / 7) <= 5 ? `1px solid #ddd` : `none`};
// border-right: ${props => (props.index % 7) + 1 === 7 ? `none` : `1px solid #ddd`};
// background: rgba(0, 102, 204, 0.075);

export const HighlightedCalendarDate = styled(CalendarDate)`
	color: var(--turquoise) !important;
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
	color: var(--light-gray) !important;
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
// color: var(--turquoise) !important;
// border-bottom: 0.5em solid var(--turquoise);
// border-left: 0.5em solid transparent;
// border-top: 0.5em solid transparent;
// background: rgba(0, 102, 204, 0.075) !important;
