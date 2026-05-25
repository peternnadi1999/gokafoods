// Function to calculate the distance between two coordinates using the Haversine formula
export function calculateDistance(
	lat1: number,
	lon1: number,
	lat2: number,
	lon2: number,
): number {
	const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

	const R = 6371; // Radius of the Earth in kilometers
	const dLat = toRadians(lat2 - lat1);
	const dLon = toRadians(lon2 - lon1);

	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(toRadians(lat1)) *
			Math.cos(toRadians(lat2)) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2);

	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	const distance = R * c;
	const distancekm = distance * 1.55;
	return distancekm;
}

// Function to estimate time based on distance and speed
export function estimateTime(distance: number, speed: number): number {
	return distance / speed; // Time in hours
}

// Function to get user's current coordinates and calculate distance and time
export async function getDistanceAndTime(foodCoordinate: {
	lat: number;
	lon: number;
}) {
	return new Promise<{ distance: number; time: number }>((resolve, reject) => {
		if (!navigator.geolocation) {
			reject(new Error("Geolocation is not supported by this browser."));
			return;
		}

		navigator.geolocation.getCurrentPosition(
			(position) => {
				const userLat = position.coords.latitude;
				const userLon = position.coords.longitude;

				const distance = calculateDistance(
					userLat,
					userLon,
					foodCoordinate.lat,
					foodCoordinate.lon,
				);
				const averageSpeed = 50; // Average speed in km/h (e.g., driving speed)
				const time = estimateTime(distance, averageSpeed) * 60; // Convert hours to minutes

				resolve({ distance, time });
			},
			(error) => {
				reject(error);
			},
		);
	});
}

export async function getCurrentPosition(): Promise<{
	lat: number;
	lng: number;
}> {
	return new Promise<{ lat: number; lng: number }>((resolve, reject) => {
		if (!navigator.geolocation) {
			reject(new Error("Geolocation is not supported by this browser."));
			return;
		}

		navigator.geolocation.getCurrentPosition(
			(position) => {
				resolve({
					lat: position.coords.latitude,
					lng: position.coords.longitude,
				});
			},
			(error) => {
				reject(error);
			},
			{
				enableHighAccuracy: true,
				timeout: 10000,
				maximumAge: 0,
			},
		);
	});
}
