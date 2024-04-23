import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';

const ColorPreview = ({ colors, limit = 3, onClick, sx, hover, width, height, isActive }) => {
    const renderColors = colors.slice(0, limit);
    const remainingColor = colors.length - limit;

    const handleColorClick = (color) => {
        if (onClick) {
            onClick(color);
        }
    };

    return (
        <Stack component="span" direction="row" alignItems="center" justifyContent="flex-end" sx={sx}>
            {renderColors.map((color, index) => (
                <Box
                    key={color + index}
                    onClick={() => handleColorClick(color)}
                    sx={{
                        ml: -0.75,
                        width: width ? width : 16,
                        height: height ? height : 16,
                        bgcolor: color,
                        borderRadius: '50%',
                        border: isActive === color ? 'solid 2px black' : (theme) => `solid 2px ${theme.palette.background.paper}`,
                        boxShadow: (theme) => `inset -1px 1px 2px ${alpha(theme.palette.common.black, 0.24)}`,
                        cursor: hover ? 'default' : 'pointer',
                        '&:hover': {
                            border: hover ? 'solid 2px black' : `solid 0.5px black`,
                        },
                    }}
                />
            ))}

            {colors.length > limit && (
                <Box component="span" sx={{ typography: 'subtitle2' }}>{`+${remainingColor}`}</Box>
            )}
        </Stack>
    );
};

ColorPreview.propTypes = {
    colors: PropTypes.arrayOf(PropTypes.string),
    limit: PropTypes.number,
    onClick: PropTypes.func,
    sx: PropTypes.object,
    hover: PropTypes.bool,
    width: PropTypes.number,
    height: PropTypes.number,
    isActive: PropTypes.string,
};

export default ColorPreview;
