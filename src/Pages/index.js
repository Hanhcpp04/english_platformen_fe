import LandingPage from "./LandingPage"
import AboutPage from "./AboutPage"
import Login from "./Login"
import SignIn from "./SignIn"
import Dashboard from "./User/Dashboard"
import Vocabulary from "./User/Vocabulary"
import VocabularyDetail from "./User/Vocabulary/VocabularyDetail"
import Grammar from "./User/Grammar"
import GrammarDetail from "./User/Grammar_detail"
import Lesson from "./User/Lesson"
import UserLayout from "../components/Layouts/DefaultLayout/UserLayout"

const PublicPage = [
    { path: "/", component: LandingPage, layout: UserLayout },
    { path: "/about", component: AboutPage, layout: UserLayout },
    { path: "/login", component: Login, layout: UserLayout },
    { path: "/register", component: SignIn, layout: UserLayout },
    { path: "/dashboard", component: Dashboard, layout: UserLayout },
    { path: "/vocabulary", component: Vocabulary, layout: UserLayout },
    { path: "/vocabulary/:topicId", component: VocabularyDetail, layout: UserLayout },
    { path: "/grammar", component: Grammar, layout: UserLayout },
    { path: "/grammar/:topicId", component: GrammarDetail, layout: UserLayout },
    { path: "/grammar/:topicId/lesson/:lessonId", component: Lesson, layout: UserLayout },
]

const PrivatePage = [
    
]

export { PublicPage, PrivatePage }