export class ShareService {
  generateShareLinks(eventId: string, title: string, description: string, url?: string) {
    const eventUrl = url || `${process.env.APP_URL}/events/${eventId}`;
    const encodedTitle = encodeURIComponent(title);
    const encodedDesc = encodeURIComponent(description.substring(0, 100));

    return {
      url: eventUrl,
      platforms: {
        twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodeURIComponent(eventUrl)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventUrl)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(eventUrl)}`,
        whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodeURIComponent(eventUrl)}`,
        email: `mailto:?subject=${encodedTitle}&body=${encodedDesc}%0A%0A${encodeURIComponent(eventUrl)}`,
      },
    };
  }
}
