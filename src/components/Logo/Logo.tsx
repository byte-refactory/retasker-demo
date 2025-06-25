import { useTheme } from '../../contexts/ThemeContext';
import useModal from '../../hooks/useModal';
import CompanyInfoModal from '../CompanyInfoModal';
import lightLogo from '../../assets/Wide-NoBackground-Light.png';
import darkLogo from '../../assets/Wide-NoBackground-Dark.png';
import './Logo.css';

interface LogoProps {
    className?: string;
}

function Logo({ className = '' }: LogoProps) {
    const { themeName, theme } = useTheme();
    const companyModal = useModal();

    const logoSrc = themeName === 'light' ? lightLogo : darkLogo;
    const altText = "Byte Refactory Logo";

    const handleLogoClick = () => {
        companyModal.open();
    };

    return (
        <>
            <div
                className={`logo-container ${className}`}
            >
                <img
                    src={logoSrc}
                    alt={altText}
                    className="logo-image"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleLogoClick();
                        }
                    }}
                    aria-label="About Byte Refactory"
                    onClick={handleLogoClick}
                    style={{ cursor: 'pointer' }}
                    role="button"
                    tabIndex={0}
                />
                <div className="product-name-container">
                    <span
                        className="separator"
                        style={{ color: theme.text.primary }}
                    >
                        |
                    </span>
                    <span
                        className="product-name"
                        style={{ color: theme.text.primary }}
                    >
                        ReTasker
                    </span>
                </div>
            </div>

            {/* Company Info Modal */}
            <CompanyInfoModal isOpen={companyModal.isOpen} onClose={companyModal.close} />
        </>
    );
}

export default Logo;
