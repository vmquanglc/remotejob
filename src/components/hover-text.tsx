import Box from '@mui/material/Box';

interface IProps {
	value: string;
}

const HoverText = ({ value }: IProps) => {
	return (
		<Box
			sx={{
				whiteSpace: 'nowrap',
				textOverflow: 'ellipsis',
				overflow: 'hidden',
				transition: 'all 1.5s ease',
				maxHeight: '20px',
				'&:hover': {
					whiteSpace: 'normal',
					transition: 'all 1.5s ease',
					maxHeight: '300px',
				},
			}}
		>
			{value}
		</Box>
	);
};

export default HoverText;
