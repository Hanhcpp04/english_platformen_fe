import LandingPage from "./LandingPage"
import ProtectedLandingPage from "./LandingPage/ProtectedLandingPage"
import AboutPage from "./AboutPage"
import Login from "./Login"
import SignIn from "./SignIn"
import Dashboard from "./User/Dashboard"
import Vocabulary from "./User/Vocabulary"
import VocabularyDetail from "./User/Vocabulary/VocabularyDetail"
import Grammar from "./User/Grammar"
import GrammarDetail from "./User/Grammar/Grammar_detail"
import Lesson from "./User/Grammar/Lesson"
import MultipleChoiceExercise from "./User/Grammar/Exercise/MultipleChoiceExercise";
import FillBlankExercise from "./User/Grammar/Exercise/FillBlankExercise";
import Profile from "./Profile"
import UserLayout from "../components/Layouts/DefaultLayout/UserLayout"
import AdminLayout from "../components/Layouts/DefaultLayout/AdminLayout"

// Writing Page
import Writing from "./User/Writing"

// Forum Pages
import ForumHome from "./User/Forum/ForumHome"
import PostList from "./User/Forum/PostList"
import CreatePostPage from "./User/Forum/CreatePostPage"
import MyPostsPage from "./User/Forum/MyPostsPage"

// Admin Pages
import AdminDashboard from "./Admin/Dashboard"
import UserManagement from "./Admin/UserManagement"
import TopicVocabManagement from "./Admin/TopicVocabManagement"
import VocabManagement from "./Admin/VocabManagement"
import GrammarManagement from "./Admin/GrammarManagement"
import WritingManagement from "./Admin/WritingManagement"
import ForumManagement from "./Admin/ForumManagement"

const PublicPage = [
    { path: "/", component: ProtectedLandingPage, layout: UserLayout },
    { path: "/about", component: AboutPage, layout: UserLayout },
    { path: "/login", component: Login, layout: UserLayout },
    { path: "/register", component: SignIn, layout: UserLayout },
    { path: "/dashboard", component: Dashboard, layout: UserLayout },
    { path: "/vocabulary", component: Vocabulary, layout: UserLayout },
    // Grammar
    { path: "/vocabulary/:topicId", component: VocabularyDetail, layout: UserLayout },
    { path: "/grammar", component: Grammar, layout: UserLayout },
    { path: "/grammar/:topicId", component: GrammarDetail, layout: UserLayout },
    { path: "/grammar/:topicId/exercises/multiple-choice", component: MultipleChoiceExercise, layout: UserLayout },
  { path: "/grammar/:topicId/exercises/fill-blank", component: FillBlankExercise, layout: UserLayout },
    { path: "/grammar/:topicId/lesson/:lessonId", component: Lesson, layout: UserLayout },
    { path: "/profile", component: Profile, layout: UserLayout },
    
    // Writing Route
    { path: "/writing", component: Writing, layout: UserLayout },
    
    // Forum Routes
    { path: "/forum", component: ForumHome, layout: UserLayout },
    { path: "/forum/posts", component: PostList, layout: UserLayout },
    { path: "/forum/my-posts", component: MyPostsPage, layout: UserLayout },
    
    // Admin Routes
    { path: "/admin/dashboard", component: AdminDashboard, layout: AdminLayout },
    { path: "/admin/users", component: UserManagement, layout: AdminLayout },
    { path: "/admin/topics", component: TopicVocabManagement, layout: AdminLayout },
    { path: "/admin/vocabulary", component: VocabManagement, layout: AdminLayout },
    { path: "/admin/grammar", component: GrammarManagement, layout: AdminLayout },
    { path: "/admin/writing", component: WritingManagement, layout: AdminLayout },
    { path: "/admin/forum", component: ForumManagement, layout: AdminLayout }
];

const PrivatePage = [
    
]

export { PublicPage, PrivatePage }