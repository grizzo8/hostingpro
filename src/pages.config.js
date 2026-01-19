import Home from './pages/Home';
import Packages from './pages/Packages';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import AffiliateSignup from './pages/AffiliateSignup';
import AffiliateDashboard from './pages/AffiliateDashboard';
import AffiliateLinks from './pages/AffiliateLinks';
import AffiliateCommissions from './pages/AffiliateCommissions';


export const PAGES = {
    "Home": Home,
    "Packages": Packages,
    "Blog": Blog,
    "BlogPost": BlogPost,
    "AffiliateSignup": AffiliateSignup,
    "AffiliateDashboard": AffiliateDashboard,
    "AffiliateLinks": AffiliateLinks,
    "AffiliateCommissions": AffiliateCommissions,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
};