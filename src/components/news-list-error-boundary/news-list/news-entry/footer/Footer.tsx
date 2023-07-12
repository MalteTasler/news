import React from 'react';
import PropTypes from 'prop-types';
import { SharingBar, Tooltip } from 'chayns-components';
import { FooterProps } from 'constants/types';
import './footer.scss';
import { FrontendUrls } from 'constants/enums';

require('../../../../../constants/chayns.d');
require('../../../../../constants/chayns-components.d');

const Footer = ({ date, dateAbsolute, id }: FooterProps) => (
    <div className="newsEntryFooter">
        <SharingBar link={`${FrontendUrls[0]}?M=${id}`} />
        <Tooltip
            content={{
                text: `${new Date(dateAbsolute).toLocaleDateString('de-DE', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                })}, ${new Date(dateAbsolute).toLocaleTimeString('de-DE')} Uhr`,
            }}
            minWidth={200}
            bindListeners
        >
            <div className="newsEntryFooter__timeDisplay">{date}</div>
        </Tooltip>
    </div>
);

Footer.propTypes = {
    date: PropTypes.string.isRequired,
    dateAbsolute: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
};

Footer.DisplayName = 'Footer';

export default Footer;
