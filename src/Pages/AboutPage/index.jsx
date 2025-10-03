
const AboutPage = () => {
    return (
        <div className="bg-gradient-to-br from-primary-50 to-orange-50 min-h-full">
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                        Về EnglishSmart
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Nền tảng học tiếng Anh thông minh với công nghệ AI tiên tiến, 
                        giúp bạn nâng cao kỹ năng tiếng Anh một cách hiệu quả và thú vị.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    <div className="bg-white rounded-xl p-6 shadow-lg">
                        <div className="text-3xl mb-4">🎯</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Sứ mệnh</h3>
                        <p className="text-gray-600">
                            Làm cho việc học tiếng Anh trở nên dễ dàng, thú vị và hiệu quả 
                            thông qua công nghệ AI và gamification.
                        </p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg">
                        <div className="text-3xl mb-4">🌟</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Tầm nhìn</h3>
                        <p className="text-gray-600">
                            Trở thành nền tảng học tiếng Anh hàng đầu Việt Nam, 
                            giúp hàng triệu người đạt được mục tiêu học tập của mình.
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-8 shadow-lg text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Tính năng nổi bật</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div>
                            <div className="text-4xl mb-3">🤖</div>
                            <h4 className="font-bold text-gray-900 mb-2">AI Chatbot</h4>
                            <p className="text-gray-600 text-sm">Luyện tập giao tiếp 24/7</p>
                        </div>
                        <div>
                            <div className="text-4xl mb-3">🎮</div>
                            <h4 className="font-bold text-gray-900 mb-2">Gamification</h4>
                            <p className="text-gray-600 text-sm">Học tập vui vẻ với XP và achievements</p>
                        </div>
                        <div>
                            <div className="text-4xl mb-3">📊</div>
                            <h4 className="font-bold text-gray-900 mb-2">Theo dõi tiến độ</h4>
                            <p className="text-gray-600 text-sm">Thống kê chi tiết quá trình học</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default AboutPage