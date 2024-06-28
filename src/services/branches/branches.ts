import { Branches } from '../../components/types/branches';

import HarmonyApi from '../config';

async function getAllBranches(token: string): Promise<Branches[]> {
  try {
    const response = await HarmonyApi.get<any>('branches', {
      headers: { Authorization: 'Bearer ' + token },
    });

    return response.data;
  } catch (e) {
    throw new Error(JSON.stringify(e));
  }
}

export const branchesServices = {
  getAllBranches,
};