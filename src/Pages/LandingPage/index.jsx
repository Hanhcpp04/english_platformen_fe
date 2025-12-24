import React from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy,
  BookOpen,
  Target,
  PenTool,
  MessageSquare,
  Award,
  Zap,
  Users,
  Sparkles,
  ArrowRight,
  TrendingUp,
  CheckCircle,
  Star,
  Quote,
  Rocket,
  Brain,
  Globe,
} from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: BookOpen,
      title: 'Từ vựng',
      description: 'Học từ vựng qua flashcard, hình ảnh sinh động và bài tập tương tác',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'hover:border-primary',
    },
    {
      icon: Target,
      title: 'Ngữ pháp',
      description: 'Bài giảng chi tiết và bài tập thực hành từ cơ bản đến nâng cao',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      borderColor: 'hover:border-secondary',
    },
    {
      icon: PenTool,
      title: 'Luyện viết',
      description: 'Nhận phản hồi từ AI và gợi ý cải thiện kỹ năng viết của bạn',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'hover:border-green-600',
    },
    {
      icon: MessageSquare,
      title: 'Diễn đàn',
      description: 'Kết nối với cộng đồng học viên, chia sẻ kinh nghiệm và học hỏi',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'hover:border-purple-600',
    },
  ];

  const gamificationFeatures = [
    {
      icon: Trophy,
      title: 'XP & Level',
      description: 'Kiếm điểm kinh nghiệm và thăng cấp qua mỗi bài học',
    },
    {
      icon: Award,
      title: 'Huy hiệu',
      description: 'Thu thập hơn 50+ huy hiệu thành tích đặc biệt',
    },
    {
      icon: Zap,
      title: 'Streak & Stats',
      description: 'Duy trì chuỗi ngày học và theo dõi báo cáo chi tiết',
    },
  ];

  const stats = [
    { icon: Users, value: '10,000+', label: 'Học viên' },
    { icon: Award, value: '50+', label: 'Huy hiệu' },
    { icon: Sparkles, value: '100%', label: 'Miễn phí' },
  ];

  const howItWorks = [
    {
      step: '01',
      icon: Rocket,
      title: 'Đăng ký tài khoản',
      description: 'Tạo tài khoản miễn phí chỉ trong 30 giây và bắt đầu hành trình học tập',
    },
    {
      step: '02',
      icon: Target,
      title: 'Chọn lộ trình phù hợp',
      description: 'Làm bài test đầu vào để hệ thống gợi ý lộ trình học phù hợp với trình độ',
    },
    {
      step: '03',
      icon: Brain,
      title: 'Học tập đều đặn',
      description: 'Hoàn thành bài học hàng ngày, tích lũy XP và mở khóa thành tích mới',
    },
    {
      step: '04',
      icon: Trophy,
      title: 'Đạt mục tiêu',
      description: 'Theo dõi tiến độ, nhận huy hiệu và nâng cao trình độ tiếng Anh',
    },
  ];

  const _learningPaths = [
    {
      level: 'Beginner',
      title: 'Cơ bản',
      description: 'Dành cho người mới bắt đầu học tiếng Anh',
      color: 'from-green-400 to-green-600',
      features: ['500+ từ vựng cơ bản', 'Ngữ pháp nền tảng', '20 bài học tương tác'],
      icon: '🌱',
    },
    {
      level: 'Intermediate',
      title: 'Trung cấp',
      description: 'Phát triển kỹ năng giao tiếp và ngữ pháp',
      color: 'from-blue-400 to-blue-600',
      features: ['1000+ từ vựng nâng cao', 'Ngữ pháp chuyên sâu', '40 bài học thực hành'],
      icon: '🚀',
      popular: true,
    },
    {
      level: 'Advanced',
      title: 'Nâng cao',
      description: 'Hoàn thiện và thành thạo tiếng Anh',
      color: 'from-purple-400 to-purple-600',
      features: ['2000+ từ vựng chuyên ngành', 'Writing & Speaking', '60 bài học chuyên sâu'],
      icon: '⭐',
    },
  ];

  const testimonials = [
    {
      name: 'Nguyễn Văn A',
      role: 'Sinh viên',
      avatar: '👨‍🎓',
      content: 'English Smart đã giúp tôi cải thiện tiếng Anh rất nhiều. Hệ thống gamification khiến việc học trở nên thú vị và không nhàm chán!',
      rating: 5,
    },
    {
      name: 'Trần Thị B',
      role: 'Nhân viên văn phòng',
      avatar: '👩‍💼',
      content: 'Tôi yêu thích tính năng theo dõi tiến độ và streak. Nó tạo động lực để tôi học đều đặn mỗi ngày.',
      rating: 5,
    },
    {
      name: 'Lê Minh C',
      role: 'Học sinh THPT',
      avatar: '👨‍🎓',
      content: 'Các bài tập tương tác và diễn đàn cộng đồng rất hữu ích. Điểm thi của tôi đã tăng đáng kể sau 3 tháng!',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-green-50 to-white-50">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-white to-white">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border-2 border-primary/20 shadow-sm animate-in fade-in slide-in-from-top duration-500">
              <Trophy className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-gray-700">
                Học tiếng Anh với gamification
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight animate-in fade-in slide-in-from-bottom duration-700">
              Nâng cao tiếng Anh{' '}
              <span className="text-primary">của bạn</span>{' '}
              mỗi ngày
            </h1>

            {/* Subheading */}
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom duration-700 delay-100">
              Trải nghiệm học tiếng Anh thú vị với gamification, theo dõi tiến trình chi tiết
              và cộng đồng học viên năng động. Học mọi lúc, mọi nơi với English Smart.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom duration-700 delay-200">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 bg-primary text-white text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                Bắt đầu miễn phí
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#features"
                className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 text-lg font-semibold rounded-lg border-2 border-gray-200 hover:border-primary hover:text-primary transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Tìm hiểu thêm
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto pt-12 animate-in fade-in slide-in-from-bottom duration-700 delay-300">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <stat.icon className="w-6 h-6 text-primary" />
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Tất cả những gì bạn cần để{' '}
              <span className="text-primary">thành thạo tiếng Anh</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`p-6 bg-white rounded-lg border-2 border-gray-100 ${feature.borderColor} hover:shadow-lg transition-all duration-300 hover:scale-105 group`}
              >
                <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Đơn giản và hiệu quả</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Bắt đầu học{' '}
              <span className="text-primary">chỉ với 4 bước</span>
            </h2>
            <p className="text-lg text-gray-600">
              Quy trình học tập được thiết kế tối ưu để bạn đạt hiệu quả cao nhất
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item, index) => (
              <div key={index} className="relative group">
                {/* Connecting line */}
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-primary/30 to-transparent -translate-x-1/2 z-0" />
                )}
                
                <div className="relative bg-white p-6 rounded-2xl border-2 border-gray-100 hover:border-primary/30 hover:shadow-xl transition-all duration-300 group-hover:scale-105 z-10">
                  {/* Step number */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {item.step}
                  </div>
                  
                  {/* Icon */}
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 mx-auto">
                    <item.icon className="w-8 h-8 text-primary" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed text-center">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      

      {/* GAMIFICATION SECTION */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Gamification</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Học tập <span className="text-primary">trở nên thú vị</span>
            </h2>
            <p className="text-lg text-gray-600">
              Với hệ thống gamification độc đáo, mỗi bài học đều mang lại trải nghiệm hấp dẫn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {gamificationFeatures.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-muted/30 rounded-xl border-2 border-gray-100 hover:border-primary/30 hover:shadow-lg transition-all duration-300 text-center"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Simple Stats Preview */}
          <div className="mt-12 p-8 bg-muted/30 rounded-2xl border-2 border-gray-100 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Trophy className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-gray-700">Theo dõi tiến độ của bạn</span>
            </div>
            
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">15</div>
                <div className="text-xs text-gray-600">Ngày streak</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">12</div>
                <div className="text-xs text-gray-600">Huy hiệu</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">89%</div>
                <div className="text-xs text-gray-600">Chính xác</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Học viên nói gì về{' '}
              <span className="text-primary">English Smart</span>
            </h2>
            <p className="text-lg text-gray-600">
              Hàng ngàn học viên đã cải thiện tiếng Anh cùng chúng tôi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl border-2 border-gray-100 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
              >
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-gray-700 text-sm leading-relaxed mb-6">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{testimonial.name}</div>
                    <div className="text-xs text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Sẵn sàng bắt đầu{' '}
              <span className="text-primary">hành trình học tiếng Anh?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tham gia cùng hàng ngàn học viên đang cải thiện tiếng Anh mỗi ngày
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              Bắt đầu ngay - Miễn phí
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
           

