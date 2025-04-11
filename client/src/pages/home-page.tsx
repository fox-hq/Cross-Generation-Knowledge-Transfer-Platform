import { HeroSection } from "@/components/hero-section";
import { FeaturedCourses } from "@/components/featured-courses";
import { HowItWorks } from "@/components/how-it-works";
import { FeaturedCourseDetail } from "@/components/featured-course-detail";
import { MentorshipSection } from "@/components/mentorship-section";
import { CommunitySection } from "@/components/community-section";
import { MarketplaceSection } from "@/components/marketplace-section";
import { JoinCommunitySection } from "@/components/join-community-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedCourses />
      <HowItWorks />
      <FeaturedCourseDetail />
      <MentorshipSection />
      <CommunitySection />
      <MarketplaceSection />
      <JoinCommunitySection />
    </>
  );
}
